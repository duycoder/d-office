import * as type from './NetworkActionType';

const initialState = {
    isConnected: false
}

const reducer = (state = initialState, action) => {
   switch(action.type){
        case type.UPDATE_NETWORK_STATUS:
            return {
                ...state,
                isConnected: action.status
            }
        
        default: 
            return state;
   }
}

export default reducer;