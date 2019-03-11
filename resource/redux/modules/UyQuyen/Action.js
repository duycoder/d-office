import * as actionType from './ActionType';

export function selectUser(userId){
    return {
        type: actionType.SELECT_USER,
        userId
    }
}