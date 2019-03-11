import * as type from './ActionType';
const initialState = {
    selectedUser: 0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case type.SELECT_USER:
            return {
                ...state,
                selectedUser: action.userId
            }
        case type.RESET_SELECTED_USER:
            return {
                ...state,
                selectedUser: 0
            }
        default: {
            return state
        }
    }
}

export default reducer;