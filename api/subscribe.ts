import { NowResponse } from '@now/node';
import { MemberStatus, SubscribeRequest } from '../types';
import ListMemberService from '../services/ListMemberService';

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
  try {
    await listMember.get();
  } catch (err) {
    // Not found in system
    // If not found, add contact to audience
    try {
      await listMember.create({
        status: MemberStatus.Subscribed,
        merge_fields: mergeFields,
        tags
      });
      return res.json({ status: 201, message: 'Added to list.' });
    } catch (error) {
      return res.json({
        status: 500,
        message: error.message || error
      });
    }
  }
  // If already in system, update the member
  try {
    await listMember.update({
      status: MemberStatus.Subscribed,
      merge_fields: mergeFields,
      tags
    });
    return res.json({
      status: 200,
      message: 'List member updated.'
    });
  } catch (error) {
    return res.json({ status: 500, message: error.message || error });
  }
}
