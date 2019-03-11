import * as type from './ActionType';
/**
 * Cập nhật các thuộc tính chính như id, type, màn hình chi tiết, màn hình gốc
 * @param {object} coreNavParams 
 */
export function updateCoreNavParams(coreNavParams) {
	return {
		type: type.UPDATE_CORE_NAV_PARAMS,
		coreNavParams
	}
}

/**
 * Cập nhật các thuộc tính ngoài như typeId, colorId...
 * @param {object} extendsNavParams 
 */
export function updateExtendsNavParams(extendsNavParams) {
	return {
		type: type.UPDATE_EXTENDS_NAV_PARAMS,
		extendsNavParams
	}
}