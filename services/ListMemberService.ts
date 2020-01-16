import md5Hash from '../utils/md5Hash';
import fetchJSON from '../utils/fetchJSON';
import {
  ListMember,
  MemberStatus,
  SubscribeAttributes,
  MailchimpMemberTagConfig
} from '../types';

const { AUDIENCE_ID, BASE_URL } = process.env;

export default class ListMemberService {
  email_address: string;
  md5: string;

  constructor(email_address: string) {
    this.email_address = email_address.toLowerCase();
    this.md5 = md5Hash(email_address);
  }

  create({
    status = MemberStatus.Subscribed,
    merge_fields = {},
    tags = []
  }: SubscribeAttributes): Promise<any> {
    const body = {
      email_address: this.email_address,
      status,
      merge_fields,
      tags
    };
    return fetchJSON(`${BASE_URL}/lists/${AUDIENCE_ID}/members`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  get(): Promise<ListMember> {
    return fetchJSON(`${BASE_URL}/lists/${AUDIENCE_ID}/members/${this.md5}`);
  }

  async update(body: SubscribeAttributes): Promise<any> {
    // TODO: Allow updating email_address
    const { status, merge_fields, tags = [] } = body;
    const requests = [];

    const updateMember = fetchJSON(
      `${BASE_URL}/lists/${AUDIENCE_ID}/members/${this.md5}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
          status,
          merge_fields
        })
      }
    );
    requests.push(updateMember);

    if (tags.length) {
      const {
        tags: existingTagConfigs
      }: { tags: MailchimpMemberTagConfig[] } = await fetchJSON(
        `${BASE_URL}/lists/${AUDIENCE_ID}/members/${this.md5}/tags`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'GET'
        }
      );
      const updatedTagConfigs = tags.map(name => ({ name, status: 'active' }));
      existingTagConfigs.forEach(existingTag => {
        if (!tags.includes(existingTag.name)) {
          updatedTagConfigs.push({
            name: existingTag.name,
            status: 'inactive'
          });
        }
      });
      const updateMemberTags = fetchJSON(
        `${BASE_URL}/lists/${AUDIENCE_ID}/members/${this.md5}/tags`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            tags: updatedTagConfigs
          })
        }
      );
      requests.push(updateMemberTags);
    }

    return Promise.all(requests);
  }
}
