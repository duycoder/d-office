import { API_URL } from "./SystemConstant";
import { isArray, asyncDelay } from "./Utilities";

//constants
const BASE_API = `${API_URL}/api`;
const POST_HEADER = new Headers({
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
});

//base
const basePost = async (customAddress, payloadBody = {}) => {
  let url = `${BASE_API}/${customAddress}/`;
  const result = await fetch(url, {
    method: 'POST',
    headers: POST_HEADER,
    body: JSON.stringify(payloadBody)
  });
  const resultJson = await result.json();
  await asyncDelay();
  return resultJson;
}
const baseGet = async (customAddress, params = []) => {
  let url = `${BASE_API}/${customAddress}/`;
  if (isArray(params)) {
    url += params.join("/")
  }
  const result = await fetch(url);
  const resultJson = await result.json();
  await asyncDelay();
  return resultJson;
}

//api calls

const lichtrucApi = () => {
  const getList = (payloadBody = {}) => basePost("Lichtruc/ListLichtruc", payloadBody);
  return {
    getList
  };
};

const vanbandenApi = () => {
  const getDetail = (params = []) => baseGet("VanBanDen/GetDetail", params);

  return {
    getDetail
  };
}


export {
  lichtrucApi,
  vanbandenApi
}