/*
* @description: hành động của văn bản trình ký
* @author: duynn
* @since: 28/05/2018
*/
import * as type from './SignDocActionType';

export function editFilterValue(filterValue){
	return {
		type: type.EDIT_FILTER_VALUE,
		filterValue
	}
}