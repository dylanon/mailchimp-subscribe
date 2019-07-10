import { createHash } from 'crypto';

export default function md5Hash(rawString: string) {
  const hash = createHash('md5');
  hash.update(rawString.toLowerCase());
  const md5 = hash.digest('hex');
  return md5;
}
