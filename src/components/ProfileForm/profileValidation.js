import memoize from 'lru-memoize';
import {createValidator, required, maxLength, email} from 'utils/validation';

const profileValidation = createValidator({
  firstName: [required, maxLength(30)],
  lastName: [required, maxLength(30)],
  username: [required, maxLength(30)],
  email: [required, email],
});
export default memoize(10)(profileValidation);
