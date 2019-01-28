/**
 * @description: xử lý trạng thái công việc
 * @author: duynn
 * @since: 22/09/2019
 */

import * as type from './ActionType';
const initialState = {
    filterValue: '',
}

const reducer = (state = initialState, action) => {
	switch(action.type){
		case type.EDIT_FILTER_VALUE:
			return{
				...state,
				filterValue: action.filterValue
			}
		default: {
			return state
		}
	}
}

export default reducer;