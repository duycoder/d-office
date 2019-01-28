/**
 * @description: xử lý trạng thái người dùng
 * @author: duynn
 * @since: 06/05/2018
 */
import * as type from './ActionType';

const initialState = {
    userInfo: {

    }
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case type.SET_USER_INFO:
            return {
                ...state,
                userInfo: action.data
            }
        default:
            return state;
    }
}

export default reducer;