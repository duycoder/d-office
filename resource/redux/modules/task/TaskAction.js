/*
	@description: hành động trong công việc
	@author: duynn
	@since: 17/05/2018
*/

import * as type from './TaskActionType';

export function updateTaskProcessors(userId, isMainProcess){
	return {
		type: type.UPDATE_TASK_PROCESSORS,
		userId,
		isMainProcess
	}
}

export function resetTaskProcessors(processType){
	return {
		type: type.RESET_TASK_PROCESSORS,
		processType
	}
}