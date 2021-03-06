import fetch from 'node-fetch';

const { API_KEY } = process.env;

export default function fetchJSON(
  url: string,
  init?: {
    headers?: {};
    method?: string;
    body?: string;
  }
): Promise<any> {
  // Prepare auth header
  const credentials = `user:${API_KEY}`;
  const buffer = Buffer.from(credentials);
  const encodedCredentials = buffer.toString('base64');
  const authHeaderValue = `Basic ${encodedCredentials}`;
  const initOrDefault = init || {};
  const headersToMerge = initOrDefault.headers || {};
  const initWithAuth = {
    ...init,
    headers: {
      Authorization: authHeaderValue,
      'Content-Type': 'application/json',
      ...headersToMerge
    }
  };
  return fetch(url, initWithAuth).then(async r => {
    if (r.status === 204) {
      // Handle empty No Content response
      return '';
    }
    const json = await r.json();
    if (r.status >= 400) {
      throw new Error(json);
    }
    return json;
  });
}
