import { NowRequest, NowResponse } from '@now/node';

export default async function(req: NowRequest, res: NowResponse) {
  return res.status(200).json({ message: 'It works!' });
}
