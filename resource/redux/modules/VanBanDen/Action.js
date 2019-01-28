/*
* @description: hành động của văn bản trình ký
* @author: duynn
* @since: 22/1/2019
*/
import * as type from './ActionType';

export function editFilterValue(filterValue){
	return {
		type: type.EDIT_FILTER_VALUE,
		filterValue
	}
}