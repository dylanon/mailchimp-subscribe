import md5Hash from '../utils/md5Hash';
import fetchJSON from '../utils/fetchJSON';
import { ListMember, MemberStatus } from '../types';

const { AUDIENCE_ID, BASE_URL } = process.env;

export default class ListMemberService {
  email: string;
  md5: string;

  constructor(email: string) {
    this.email = email.toLowerCase();
    this.md5 = md5Hash(email);
  }

  create(
    status: MemberStatus = MemberStatus.Subscribed,
    merge_fields?: {}
  ): Promise<any> {
    const body = {
      email_address: this.email,
      status,
      merge_fields,
    };
    return fetchJSON(`${BASE_URL}/lists/${AUDIENCE_ID}/members`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  get(): Promise<ListMember> {
    return fetchJSON(`${BASE_URL}/lists/${AUDIENCE_ID}/members/${this.md5}`);
  }

  update(body: {}): Promise<any> {
    return fetchJSON(`${BASE_URL}/lists/${AUDIENCE_ID}/members/${this.md5}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
}
