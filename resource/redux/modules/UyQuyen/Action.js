import * as actionType from './ActionType';


export function selectUser(userId){
    return {
        type: actionType.SELECT_USER,
        userId
    }
}

/**
 * độ khẩn văn bản đến
 * @param {*} data 
 */
export function setVanBanDenDoKhan(data){
    return {
        type: actionType.SET_VANBANDEN_DOKHAN,
        data
    }
}

export function selectVanBanDenDoKhan(data){
    return {
        type: actionType.SELECT_VANBANDEN_DOKHAN,
        data
    }
}

/**
 * độ mật văn bản đến
 * @param {*} data 
 */
export function setVanBanDenDoMat(data){
    return {
        type: actionType.SET_VANBANDEN_DOMAT,
        data
    }
}

export function selectVanBanDenDoMat(data){
    return {
        type: actionType.SELECT_VANBANDEN_DOMAT,
        data
    }
}

/**
 * lĩnh vực văn bản đến
 * @param {*} data 
 */
export function setVanBanDenLinhVucVanBan(data){
    return {
        type: actionType.SET_VANBANDEN_LINHVUC,
        data
    }
}

export function selectVanBanDenLinhVucVanBan(data){
    return {
        type: actionType.SELECT_VANBANDEN_LINHVUC,
        data
    }
}

/**
 * loại văn bản đến
 * @param {*} data 
 */
export function setVanBanDenLoaiVanBan(data){
    return {
        type: actionType.SET_VANBANDEN_LOAI,
        data
    }
}

export function selectVanBanDenLoaiVanBan(data){
    return {
        type: actionType.SELECT_VANBANDEN_LOAI,
        data
    }
}


/**
 * độ ưu tiên văn bản đi
 * @param {*} data 
 */
export function setVanBanDiDoUuTien(data){
    return {
        type: actionType.SET_VANBANDI_DOUUTIEN,
        data
    }
}

export function selectVanBanDiDoUuTien(data){
    return {
        type: actionType.SELECT_VANBANDI_DOUUTIEN,
        data
    }
}

/**
 * độ quan trọng văn bản đi
 * @param {*} data 
 */
export function setVanBanDiDoQuanTrong(data){
    return {
        type: actionType.SET_VANBANDI_DOQUANTRONG,
        data
    }
}

export function selectVanBanDiDoQuanTrong(data){
    return {
        type: actionType.SELECT_VANBANDI_DOQUANTRONG,
        data
    }
}

/**
 * lĩnh vực văn bản đi
 * @param {*} data 
 */
export function setVanBanDiLinhVucVanBan(data){
    return {
        type: actionType.SET_VANBANDI_LINHVUC,
        data
    }
}

export function selectVanBanDiLinhVucVanBan(data){
    return {
        type: actionType.SELECT_VANBANDI_LINHVUC,
        data
    }
}

/**
 * loại văn bản đi
 * @param {*} data 
 */
export function setVanBanDiLoaiVanBan(data){
    return {
        type: actionType.SET_VANBANDI_LOAI,
        data
    }
}

export function selectVanBanDiLoaiVanBan(data){
    return {
        type: actionType.SELECT_VANBANDI_LOAI,
        data
    }
}

