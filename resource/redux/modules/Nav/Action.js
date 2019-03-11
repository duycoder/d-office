import * as type from './ActionType';

export function updateCoreNavParams(coreNavParams) {
	return {
		type: type.UPDATE_CORE_NAV_PARAMS,
		coreNavParams
	}
}

export function updateExtendsNavParams(extendsNavParams) {
	return {
		type: type.UPDATE_EXTENDS_NAV_PARAMS,
		extendsNavParams
	}
}