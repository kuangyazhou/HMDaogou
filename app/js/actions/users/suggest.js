import {
  callApi,
  ID_TOKEN,
  loadIdToken,
  removeIdToken,
  RESTFUL_SERVER,
} from '../../utils/apiUtils';

export default function sendSuggest(content) {
  const profile = loadIdToken();
  const userId = profile.userId;
  /* eslint max-len: [0] */
  const token = `${userId},${profile.workNum},${profile.position},${profile.storeCode},${profile.storeOutletId}`;
  const config = {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({}),
  };
  return fetch(`${RESTFUL_SERVER}/crm/opinionFeedback.json?token=${token}&content=${content}`, config)
  .then(res => res.json())
  .then((json => json))
  .then(err => err);
}
