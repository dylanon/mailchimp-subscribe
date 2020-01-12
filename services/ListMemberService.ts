import md5Hash from '../utils/md5Hash';
import fetchJSON from '../utils/fetchJSON';
import { ListMember, MemberStatus, SubscribeAttributes } from '../types';

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

  update(body: SubscribeAttributes): Promise<any> {
    // TODO: Allow updating email_address
    // TODO: Allow updating tags - (Mailchimp sends 204 with invalid JSON for some reason)
    const { status, merge_fields } = body;
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
    const requests = [updateMember];
    return Promise.all(requests);
  }
}
