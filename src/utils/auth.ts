import { validateCode } from '../api';

export function validateActivationCode(
  code = 'ZVhWcWFXNXdZVzQ9MTY4NzAwMDk0ODUyNDE2ODcwMDA5NDg1MjQ=',
): Promise<number> {
  return validateCode(code).then((res) => {
    return res.json().then((res) => res.count);
  });
}
