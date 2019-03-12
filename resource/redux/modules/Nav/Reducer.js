import * as type from './ActionType';

const initialState = {
  coreNavParams: {},
  extendsNavParams: {},
  pastCoreParams: [], // save old coreNavParams
  actionId: 0, // detect if that flow has changes?
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
    case type.UPDATE_ACTION_ID:
      return {
        ...state,
        actionId: action.actionId
      };
    default:
      return state;
  }
}

export default reducer;