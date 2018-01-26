import { watchRequestLogin } from './auth';

export default function* rootSaga() {
  yield [
    watchRequestLogin(),
  ];
}
