/**
 * @description: xử lý trạng thái công việc
 * @author: duynn
 * @since: 17/05/2018
 */
import * as type from './ActionType';
import { TASK_PROCESS_TYPE, WORKFLOW_PROCESS_TYPE } from '../../../common/SystemConstant';

const initialState = {
    mainProcessUser: 0,
    joinProcessUsers: [],
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case type.UPDATE_TASK_PROCESSORS:
            let finalMainProcessResult = state.mainProcessUser;
            let finalJoinProcessResult = state.joinProcessUsers;

            if (action.isMainProcess) {
                finalMainProcessResult = action.userId;
            } else {
                const index = finalJoinProcessResult.indexOf(action.userId);
                if (index > -1) {
                    finalJoinProcessResult.splice(index, 1)
                } else {
                    finalJoinProcessResult.push(action.userId);
                }
            }
            return {
                ...state,
                mainProcessUser: finalMainProcessResult,
                joinProcessUsers: finalJoinProcessResult
            }
        case type.RESET_TASK_PROCESSORS: {
            if (action.processType == TASK_PROCESS_TYPE.MAIN_PROCESS) {
                return {
                    ...state,
                    mainProcessUser: 0
                }
            } else if (action.processType == TASK_PROCESS_TYPE.JOIN_PROCESS) {
                return {
                    ...state,
                    joinProcessUsers: []
                }
            }
            
            return {
                ...state,
                mainProcessUser: 0,
                joinProcessUsers: []
            }
        }
        default:
            return state;
    }
}

export default reducer;