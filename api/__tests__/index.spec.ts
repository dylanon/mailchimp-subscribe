import subscribe from '../subscribe';
import { NowRequest, NowResponse } from '@now/node';

const mockJson = jest.fn();
const mockStatus = jest.fn(function(this: NowResponse, code) {
  return this;
});
const mockRes: unknown = {
  json: mockJson,
  status: mockStatus,
};

it('signals a 400 status if an email is not supplied', async () => {
  await subscribe({ body: {} } as NowRequest, mockRes as NowResponse);
  expect(mockJson.mock.calls[0][0]['status']).toBe(400);
});
