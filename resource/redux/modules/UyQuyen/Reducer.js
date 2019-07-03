import * as type from './ActionType';
import * as util from 'lodash';
const initialState = {
    selectedUser: 0,
    groupVanBanDenDoKhan: [],
    groupVanBanDenDoMat: [],
    groupVanBanDenLinhVucVanBan: [],
    groupVanBanDenLoaiVanBan: [],

    groupVanBanDiDoUuTien: [],
    groupVanBanDiDoQuanTrong: [],
    groupVanBanDiLinhVucVanBan: [],
    groupVanBanDiLoaiVanBan: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case type.SELECT_USER:
            return {
                ...state,
                selectedUser: action.userId
            }
        case type.RESET_SELECTED_USER:
            return {
                ...state,
                selectedUser: 0
            }
        case type.SET_VANBANDEN_DOKHAN:
            return {
                ...state,
                groupVanBanDenDoKhan: action.data
            }
        case type.SELECT_VANBANDEN_DOKHAN:
            let inputDoKhanVanBan = util.toInteger(action.data);
            let groupDoKhanVanBan = state.groupVanBanDenDoKhan;
            if (groupDoKhanVanBan.indexOf(inputDoKhanVanBan) > -1) {
                groupDoKhanVanBan = groupDoKhanVanBan.filter(item => item != action.data);
            } else {
                groupDoKhanVanBan.push(inputDoKhanVanBan);
            }
            return {
                ...state,
                groupVanBanDenDoKhan: groupDoKhanVanBan
            }
        case type.SET_VANBANDEN_DOMAT:
            return {
                ...state,
                groupVanBanDenDoMat: action.data
            }
        case type.SELECT_VANBANDEN_DOMAT:
            let inputDoMatVanBan = util.toInteger(action.data);
            let groupDoMatVanBan = state.groupVanBanDenDoMat;
            if (groupDoMatVanBan.indexOf(inputDoMatVanBan) > -1) {
                groupDoMatVanBan = groupDoMatVanBan.filter(item => item != action.data);
            } else {
                groupDoMatVanBan.push(inputDoMatVanBan);
            }
            return {
                ...state,
                groupVanBanDenDoMat: groupDoMatVanBan
            }

        case type.SET_VANBANDEN_LINHVUC:
            return {
                ...state,
                groupVanBanDenLinhVucVanBan: action.data
            }
        case type.SELECT_VANBANDEN_LINHVUC:
            let inputLinhVucVanBan = util.toInteger(action.data);
            let groupLinhVucVanBan = state.groupVanBanDenLinhVucVanBan;
            if (groupLinhVucVanBan.indexOf(inputLinhVucVanBan) > -1) {
                groupLinhVucVanBan = groupLinhVucVanBan.filter(item => item != action.data);
            } else {
                groupLinhVucVanBan.push(inputLinhVucVanBan);
            }
            return {
                ...state,
                groupVanBanDenLinhVucVanBan: groupLinhVucVanBan
            }
        case type.SET_VANBANDEN_LOAI:
            return {
                ...state,
                groupVanBanDenLoaiVanBan: action.data
            }
        case type.SELECT_VANBANDEN_LOAI:
            let groupLoaiVanBan = state.groupVanBanDenLoaiVanBan;
            let inputLoaiVanBan = util.toInteger(action.data);
            if (groupLoaiVanBan.indexOf(inputLoaiVanBan) > -1) {
                groupLoaiVanBan = groupLoaiVanBan.filter(item => item != inputLoaiVanBan);
            } else {
                groupLoaiVanBan.push(inputLoaiVanBan);
            }
            return {
                ...state,
                groupVanBanDenLoaiVanBan: groupLoaiVanBan
            }

        case type.SET_VANBANDI_DOUUTIEN:
            return {
                ...state,
                groupVanBanDiDoUuTien: action.data
            }
        case type.SELECT_VANBANDI_DOUUTIEN:
            let inputDoUuTienVanBan = util.toInteger(action.data);
            let groupDoUuTienVanBan = state.groupVanBanDiDoUuTien;
            if (groupDoUuTienVanBan.indexOf(inputDoUuTienVanBan) > -1) {
                groupDoUuTienVanBan = groupDoUuTienVanBan.filter(item => item != action.data);
            } else {
                groupDoUuTienVanBan.push(inputDoUuTienVanBan);
            }
            return {
                ...state,
                groupVanBanDiDoUuTien: groupDoUuTienVanBan
            }
        case type.SET_VANBANDI_DOQUANTRONG:
            return {
                ...state,
                groupVanBanDiDoQuanTrong: action.data
            }
        case type.SELECT_VANBANDI_DOQUANTRONG:
            let inputDoQuanTrongVanBan = util.toInteger(action.data);
            let groupDoQuanTrongVanBan = state.groupVanBanDiDoQuanTrong;

            if (groupDoQuanTrongVanBan.indexOf(inputDoQuanTrongVanBan) > -1) {
                groupDoQuanTrongVanBan = groupDoQuanTrongVanBan.filter(item => item != action.data);
            } else {
                groupDoQuanTrongVanBan.push(inputDoQuanTrongVanBan);
            }
            return {
                ...state,
                groupVanBanDiDoQuanTrong: groupDoQuanTrongVanBan
            }

        case type.SET_VANBANDI_LINHVUC:
            return {
                ...state,
                groupVanBanDiLinhVucVanBan: action.data
            }
        case type.SELECT_VANBANDI_LINHVUC:
            let inputLinhVucVanBanDi = util.toInteger(action.data);
            let groupLinhVucVanBanDi = state.groupVanBanDiLinhVucVanBan;
            if (groupLinhVucVanBanDi.indexOf(inputLinhVucVanBanDi) > -1) {
                groupLinhVucVanBanDi = groupLinhVucVanBanDi.filter(item => item != action.data);
            } else {
                groupLinhVucVanBanDi.push(inputLinhVucVanBanDi);
            }
            return {
                ...state,
                groupVanBanDiLinhVucVanBan: groupLinhVucVanBanDi
            }
        case type.SET_VANBANDI_LOAI:
            return {
                ...state,
                groupVanBanDiLoaiVanBan: action.data
            }
        case type.SELECT_VANBANDI_LOAI:
            let groupLoaiVanBanDi = state.groupVanBanDiLoaiVanBan;
            let inputLoaiVanBanDi = util.toInteger(action.data);
            if (groupLoaiVanBanDi.indexOf(inputLoaiVanBanDi) > -1) {
                groupLoaiVanBanDi = groupLoaiVanBanDi.filter(item => item != inputLoaiVanBanDi);
            } else {
                groupLoaiVanBanDi.push(inputLoaiVanBanDi);
            }
            return {
                ...state,
                groupVanBanDiLoaiVanBan: groupLoaiVanBanDi
            }

        default: {
            return state
        }
    }
}

export default reducer;