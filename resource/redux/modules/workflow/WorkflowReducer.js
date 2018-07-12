/**
 * @description: xử lý trạng thái luồng công việc
 * @author: duynn
 * @since: 06/05/2018
 */
import * as type from './WorkflowActionType';
import { WORKFLOW_PROCESS_TYPE } from '../../../common/SystemConstant';

const initialState = {
    reviewUsers: [],
    mainProcessUser: 0,
    joinProcessUsers: [],
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case type.UPDATE_REVIEW_USERS:
            let finalResult = state.reviewUsers;
            
            const index = finalResult.indexOf(action.userId);
            if(index > -1){
                finalResult.splice(index, 1)
            }else{
                finalResult.push(action.userId);
            }
            return {
                ...state,
                reviewUsers: finalResult
            }
        case type.UPDATE_PROCESS_USERS:
            let finalMainProcessResult = state.mainProcessUser;
            let finalJoinProcessResult = state.joinProcessUsers;
            
            if(action.isMainProcess){
                finalMainProcessResult = action.userId;
            } else {
                const index = finalJoinProcessResult.indexOf(action.userId);
                if(index > -1){
                    finalJoinProcessResult.splice(index, 1)
                }else{
                    finalJoinProcessResult.push(action.userId);
                }
            }
            return {
                ...state,
                mainProcessUser: finalMainProcessResult,
                joinProcessUsers: finalJoinProcessResult
            }
        case type.RESET_PROCESS_USERS:
            if(action.workflowProcessType == WORKFLOW_PROCESS_TYPE.MAIN_PROCESS){
                return {
                    ...state,
                    mainProcessUser: 0,
                }
            } else if(action.workflowProcessType == WORKFLOW_PROCESS_TYPE.JOIN_PROCESS){
                return {
                    ...state,
                    joinProcessUsers: [],
                }
            } else {
                return {
                    ...state,
                    reviewUsers: [],
                    mainProcessUser: 0,
                    joinProcessUsers: [],
                }
            }
            
        default:
            return state;
    }
}

export default reducer;