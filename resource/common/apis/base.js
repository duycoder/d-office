import { API_URL } from "../SystemConstant";
import { isArray, asyncDelay, isObjectEmpty } from "../Utilities";

const BASE_API = `${API_URL}/api`;
const POST_HEADER = new Headers({
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
});

export default () => {
  const post = async (customAddress, payloadBody = {}, payloadHeaders = {}) => {
    let url = `${BASE_API}/${customAddress}/`;
    const result = await fetch(url, {
      method: 'POST',
      headers: isObjectEmpty(payloadHeaders) ? POST_HEADER : new Headers(payloadHeaders),
      body: JSON.stringify(payloadBody)
    });
    const resultJson = await result.json();
    await asyncDelay();
    return resultJson;
  }
  const get = async (customAddress, params = []) => {
    let url = `${BASE_API}/${customAddress}/`;
    if (isArray(params)) {
      url += params.join("/")
    }
    const result = await fetch(url);
    const resultJson = await result.json();
    await asyncDelay();
    return resultJson;
  }

  return {
    get,
    post,
  };
}