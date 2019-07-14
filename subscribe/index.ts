import { NowRequest, NowResponse } from '@now/node';
import { MemberStatus } from '../types';
import ListMemberService from '../services/listMemberService';

export default async function(req: NowRequest, res: NowResponse) {
  const { body = {} } = req;
  const {
    email,
    mergeFields = {},
  }: {
    email: string;
    mergeFields: {
      [prop: string]: string;
    };
  } = body;
  if (!email) {
    return res
      .status(400)
      .json({ error: "Missing required field 'email' in request body." });
  }
  // Check subscription status
  const listMember = new ListMemberService(email);
  const member = await listMember.get().catch(async () => {
    // Not found in system
    // If not found, add contact to audience
    await listMember
      .create(MemberStatus.Subscribed, mergeFields)
      .catch(error => {
        return res.json({ error: error });
      });
    return res.json({ message: 'Added to list.' });
  });
  // Already in system
  const { status } = member;
  // If subscribed, bail and send success
  if (status === MemberStatus.Subscribed) {
    return res.json({ message: 'Already subscribed.' });
  }
  // If unsubscribed/pending/cleaned, update status to 'subscribed'
  await listMember
    .update({
      status: MemberStatus.Subscribed,
    })
    .catch(e => {
      return res.json({ error: e });
    });
  return res.json({ message: "List member updated to 'subscribed'." });
}
