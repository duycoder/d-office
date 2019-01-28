/*
	@description: hành động của luồng xử lý
	@author: duynn
	@since: 16/05/2018
*/
import * as type from './ActionType';

export function updateReviewUsers(userId){
	return {
		type: type.UPDATE_REVIEW_USERS,
		userId
	}
}


export function updateProcessUsers(userId, isMainProcess){
	return {
		type: type.UPDATE_PROCESS_USERS,
		userId,
		isMainProcess
	}
}

export function resetProcessUsers(workflowProcessType){
	return {
		type: type.RESET_PROCESS_USERS,
		workflowProcessType
	}
}