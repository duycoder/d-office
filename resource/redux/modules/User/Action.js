/**
 * @description: hành động người dùng
 * @author: duynn
 * @since: 06/05/2018
 */
import * as type from './ActionType';

export function setUserInfo(data){
    return {
        type: type.SET_USER_INFO,
        data
    }
}
