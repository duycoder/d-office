import * as type from './ActionType';

const initialState = {
  coreNavParams: {},
  extendsNavParams: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case type.UPDATE_CORE_NAV_PARAMS:
      return {
        ...state,
        coreNavParams: action.coreNavParams
      };
    case type.UPDATE_EXTENDS_NAV_PARAMS:
      return {
        ...state,
        extendsNavParams: action.extendsNavParams
      };
    default:
      return state;
  }
}

export default reducer;