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
      ...headersToMerge,
    },
  };
  return fetch(url, initWithAuth).then(async r => {
    const json = await r.json();
    if (r.status >= 400) {
      throw new Error(json);
    }
    return json;
  });
}
