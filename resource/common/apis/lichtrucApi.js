import base from "./base";
const api = base();

export default () => {
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
