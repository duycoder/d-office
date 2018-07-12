/**
 * @description: toàn bộ reducer của hệ thống
 * @author: duynn
 * @since: 06/05/2018
 */

import { combineReducers } from 'redux';

import userReducer from '../modules/user/UserReducer';
import workflowReducer from '../modules/workflow/WorkflowReducer';
import taskReducer from '../modules/task/TaskReducer'
import signDocReducer from '../modules/signdoc/SignDocReducer';
import networkReducer from '../modules/network/NetworkReducer';

export const globalReducer = combineReducers({
    userState: userReducer,
    workflowState: workflowReducer,
    taskState: taskReducer,  
    signDocState: signDocReducer,
    networkState: networkReducer
});