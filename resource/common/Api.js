import { API_URL } from "./SystemConstant";
import { isArray, asyncDelay, isObjectEmpty } from "./Utilities";

//constants
const BASE_API = `${API_URL}/api`;
const POST_HEADER = new Headers({
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
});

//base
const baseApi = () => {
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
    post
  };
}
const api = baseApi();

//api calls

const lichtrucApi = () => {
  const getList = (payloadBody = {}) => api.post("Lichtruc/ListLichtruc", payloadBody);
  return {
    getList
  };
};

const vanbandenApi = () => {
  const getDetail = (params = []) => api.get("VanBanDen/GetDetail", params);
  const checkFlow = (params = []) => api.get("WorkFlow/CheckCanProcessFlow", params);

  return {
    getDetail,
    checkFlow
  };
}

const accountApi = () => {
  const deactivateToken = (payloadBody = {}) => api.post("Account/DeActiveUserToken", payloadBody);
  const getHotline = (params = []) => api.get("Account/GetHotlines");
  const getDataUyQuyen = (params = []) => api.get("Account/GetUyQuyenMessages");
  const getBirthdayData = (params = []) => api.get("Account/GetBirthdayData");
  const getNotifyCount = (params = []) => api.get("Account/GetNumberOfMessagesOfUser", params);
  const getRecentNoti = (params = []) => api.get("Account/GetMessagesOfUser", params);
  const updateReadStateOfMessage = (payloadBody = {}) => api.post("Account/UpdateReadStateOfMessage", payloadBody);

  const getCalendarData = (params = []) => api.get("LichCongTac/GetLichCongTacNgay", params);

  return {
    deactivateToken,
    getHotline,
    getDataUyQuyen,
    getBirthdayData,
    getNotifyCount,
    getRecentNoti,
    getCalendarData,
    updateReadStateOfMessage
  };
}

const carApi = () => {
  const getCreateHelper = (params = []) => api.get("CarRegistration/CreateCarRegistration", params);
  const saveRegistration = (payloadBody = {}) => api.post("CarRegistration/SaveCarRegistration", payloadBody);
  const acceptRegistration = (payloadBody = {}) => api.post("CarRegistration/AcceptCarRegistration", payloadBody);
  const getDetail = (params = []) => api.get("CarRegistration/DetailCarRegistration", params);
  const sendRegistration = (payloadBody = {}) => api.post("CarRegistration/SendCarRegistration", payloadBody);
  const cancelRegistration = (payloadBody = {}) => api.post("CarRegistration/CancelRegistration", payloadBody);

  return {
    getCreateHelper,
    saveRegistration,
    acceptRegistration,
    getDetail,
    sendRegistration,
    cancelRegistration
  };
}

const tripApi = () => {
  const getDetail = (params = []) => api.get("CarRegistration/DetailCarRegistration", params);
  const getDetailByRegistrationId = (params = []) => api.get("CarTrip/DetailTripByRegistrationId", params);
  const getCreateHelper = (params = []) => api.get("CarTrip/CreateTrip", params);
  const filterDrivers = (params = []) => api.get("CarTrip/SearchGroupOfDrivers", params);
  const filterCars = (params = []) => api.get("CarTrip/SearchGroupOfCars", params);
  const startTrip = (payloadBody = {}) => api.post("CarTrip/CheckStartTrip", payloadBody);
  const returnTrip = (payloadBody = {}) => api.post("", payloadBody);

  return {
    getDetail,
    getCreateHelper,
    filterDrivers,
    filterCars,
    getDetailByRegistrationId
  };
}

export {
  lichtrucApi,
  vanbandenApi,
  accountApi,
  carApi,
  tripApi
}