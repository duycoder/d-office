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
  const approveLichtruc = (payloadBody = {}) => api.post("Lichtruc/PheduyetLichtruc", payloadBody);
  const getDetail = (params = []) => api.get("Lichtruc/DetailLichtruc", params);
  const getPersonalList = (payloadBody = {}) => api.post("Lichtruc/ListPersonal", payloadBody);

  return {
    getList,
    approveLichtruc,
    getDetail,
    getPersonalList,
  };
};

const vanbandenApi = () => {
  const getDetail = (params = []) => api.get("VanBanDen/GetDetail", params);
  const checkFlow = (params = []) => api.get("WorkFlow/CheckCanProcessFlow", params);
  const getFlowCCHelper = (params = []) => api.get("WorkFlow/GetFlowCCHelper", params);
  const filterFlowCCReceiver = (params = []) => api.get("WorkFlow/GetFlowCCReceiver", params);
  const saveFlowCC = (payloadBody = {}) => api.post("WorkFlow/SaveFlowCC", payloadBody);
  const getFlow = (params = []) => api.get("WorkFlow/GetFlow", params);
  const saveFlow = (payloadBody={})=>api.post("WorkFlow/SaveFlow",payloadBody);
  const getUserInFlow = (params=[])=>api.get("WorkFlow/SearchUserInFlow",params);

  return {
    getDetail,
    checkFlow,
    saveFlowCC,
    getFlowCCHelper,
    filterFlowCCReceiver,
    getFlow,
    saveFlow,
    getUserInFlow,
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

  const getListNotiUyquyen = (params = []) => api.get("Account/GetUyQuyenMessages");
  const saveNotiUyquyen = (payloadBody = {}) => api.post("Account/SaveNotiUyQuyen", payloadBody);
  const getDetailNotiUyquyen = (params = []) => api.get("Account/GetDetailNoti", params);

  const updateInfo = (payloadBody = {}) => api.post("Account/UpdatePersonalInfo", payloadBody);
  const getInfo = (params = []) => api.get("Account/GetUserInfo", params);
  const postLogin = (payloadBody = {}) => api.post("Account/Login", payloadBody);
  const postSignup = (payloadBody = {}) => api.post("Account/SignUp", payloadBody);

  return {
    deactivateToken,
    getHotline,
    getDataUyQuyen,
    getBirthdayData,
    getNotifyCount,
    getRecentNoti,
    getCalendarData,
    updateReadStateOfMessage,

    getListNotiUyquyen,
    saveNotiUyquyen,
    getDetailNotiUyquyen,
    updateInfo,
    getInfo,
    postLogin,
    postSignup,
  };
}

const carApi = () => {
  const getCreateHelper = (params = []) => api.get("CarRegistration/CreateCarRegistration", params);
  const saveRegistration = (payloadBody = {}) => api.post("CarRegistration/SaveCarRegistration", payloadBody);
  const acceptRegistration = (payloadBody = {}) => api.post("CarRegistration/AcceptCarRegistration", payloadBody);
  const rejectRegistration = (payloadBody = {}) => api.post("CarRegistration/RejectCarRegistration", payloadBody);
  const getDetail = (params = []) => api.get("CarRegistration/DetailCarRegistration", params);
  const sendRegistration = (payloadBody = {}) => api.post("CarRegistration/SendCarRegistration", payloadBody);
  const cancelRegistration = (payloadBody = {}) => api.post("CarRegistration/CancelRegistration", payloadBody);
  const getList = (params = []) => api.get("CarRegistration/ListCarRegistration", params);
  const getCanbo = (params = []) => api.get("CarRegistration/CreateCarRegistrationHelper", params);
  //TODO: fill out checkRegistration API URL
  const checkRegistration = (payloadBody = {}) => api.post("CarRegistration/CheckCarRegistration", payloadBody);

  return {
    getCreateHelper,
    saveRegistration,
    acceptRegistration,
    rejectRegistration,
    getDetail,
    sendRegistration,
    cancelRegistration,
    getList,
    getCanbo,
    checkRegistration
  };
}

const tripApi = () => {
  const getDetail = (params = []) => api.get("CarRegistration/DetailCarRegistration", params);
  const getDetailByRegistrationId = (params = []) => api.get("CarTrip/DetailTripByRegistrationId", params);
  const getCreateHelper = (params = []) => api.get("CarTrip/CreateTrip", params);
  const filterDrivers = (params = []) => api.get("CarTrip/SearchGroupOfDrivers", params);
  const filterCars = (params = []) => api.get("CarTrip/SearchGroupOfCars", params);
  const startTrip = (payloadBody = {}) => api.post("CarTrip/CheckStartTrip", payloadBody);
  const returnTrip = (payloadBody = {}) => api.post("CarTrip/CheckReturnTrip", payloadBody);
  const getList = (params = []) => api.get("CarTrip/ListCarTrips", params);

  return {
    getDetail,
    getCreateHelper,
    filterDrivers,
    filterCars,
    getDetailByRegistrationId,
    startTrip,
    returnTrip,
    getList
  };
}

const meetingRoomApi = () => {
  const getRooms = (payloadBody = {}) => api.post("MeetingRoom/SearchPhonghop", payloadBody);
  const saveRoom = (payloadBody = {}) => api.post("MeetingRoom/SavePhonghop", payloadBody);
  const getCreateHelper = (params = []) => api.get("MeetingRoom/CreateLichhop", params);
  const saveCalendar = (payloadBody = {}) => api.post("MeetingRoom/SaveLichhop", payloadBody);
  const getDetail = (params = []) => api.get("MeetingRoom/DetailLichhop", params);
  const cancelCalendar = (payloadBody = {}) => api.post("MeetingRoom/CancelLichhop", payloadBody);
  const getListCalendar = (payloadBody = {}) => api.post("MeetingRoom/ListLichhop", payloadBody);
  const getNguoichutri = (params = []) => api.get("MeetingRoom/SearchChutriHop", params);

  return {
    getRooms,
    saveRoom,
    getCreateHelper,
    saveCalendar,
    getDetail,
    cancelCalendar,
    getListCalendar,
    getNguoichutri
  };
}

const reminderApi = () => {
  const getList = (payloadBody = {}) => api.post("Reminder/ListReminder", payloadBody);
  const getCreateHelper = (params = []) => api.get("Reminder/CreateReminder", params);
  const saveReminder = (payloadBody = {}) => api.post("Reminder/SaveReminder", payloadBody);
  const deleteReminder = (payloadBody = {}) => api.post("Reminder/DeleteReminder", payloadBody);
  const toggleReminder = (payloadBody = {}) => api.post("Reminder/ToggleReminder", payloadBody);
  const getWhoseReminder = (params = []) => api.get("Reminder/SearchWhoseReminder", params);

  return {
    getList,
    getCreateHelper,
    saveReminder,
    deleteReminder,
    toggleReminder,
    getWhoseReminder
  };
}

const commentApi = () => {

}

const calendarApi = () => {
  const getDetail = (params = []) => api.get("LichCongTac/GetDetail", params);

  return {
    getDetail
  };
}

const vanbandiApi = () => {

}

const taskApi = () => {
  //active
  const getCreateHelper = (params = []) => api.get("HscvCongViec/GetTaskCreationHelper", params);
  const saveTask = (payloadBody = {}) => api.post("HscvCongViec/CreateTask", payloadBody);
  const saveSubTask = (payloadBody = {}) => api.post("HscvCongViec/CreateSubTask", payloadBody);
  const getDetail = (params = []) => api.get("HscvCongViec/JobDetail", params);
  const startTask = (payloadBody = {}) => api.post("HscvCongViec/BeginProcess", payloadBody);
  const getTaskAssigner = (payloadBody = {}) => api.post("HscvCongViec/GetListGiaoviec", payloadBody);
  //TODO: added plan to deprecated

  return {
    getCreateHelper,
    saveTask,
    saveSubTask,
    getDetail,
    startTask,
    getTaskAssigner,
  };
}

export {
  lichtrucApi,
  vanbandenApi,
  accountApi,
  carApi,
  tripApi,
  meetingRoomApi,
  reminderApi,
  calendarApi,
  vanbandiApi,
  taskApi
};