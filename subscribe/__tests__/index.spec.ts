import subscribe from '..';
import { NowRequest, NowResponse } from '@now/node';

const mockJson = jest.fn();
const mockStatus = jest.fn(function(this: NowResponse, code) {
  return this;
});
const mockRes: unknown = {
  json: mockJson,
  status: mockStatus,
};

it('responds with 400 if an email is not supplied', async () => {
  await subscribe({ body: {} } as NowRequest, mockRes as NowResponse);
  expect(mockStatus).toHaveBeenCalledWith(400);
});
