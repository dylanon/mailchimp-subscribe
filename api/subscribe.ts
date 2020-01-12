import { NowResponse } from '@now/node';
import { MemberStatus, SubscribeRequest } from '../types';
import ListMemberService from '../services/ListMemberService';

// TODO: Fix problematic error catching
// Can't bail from the handler when using .catch with await

export default async function(req: SubscribeRequest, res: NowResponse) {
  const { body } = req;
  const { email, mergeFields = {}, tags = [] } = body;
  if (!email) {
    return res.json({
      status: 400,
      message: "Missing required field 'email' in request body."
    });
  }
  // Check subscription status
  const listMember = new ListMemberService(email);
  const member = await listMember.get().catch(async () => {
    // Not found in system
    // If not found, add contact to audience
    await listMember
      .create({
        status: MemberStatus.Subscribed,
        merge_fields: mergeFields,
        tags
      })
      .catch(error => {
        return res.json({
          status: 500,
          message: error.message || error
        });
      });
    return res.json({ status: 201, message: 'Added to list.' });
  });
  // If already in system, update the member
  await listMember
    .update({
      status: MemberStatus.Subscribed,
      merge_fields: mergeFields,
      tags
    })
    .catch(e => {
      return res.json({ status: 500, message: e.message || e });
    });
  return res.json({
    status: 200,
    message: 'List member updated.'
  });
}
