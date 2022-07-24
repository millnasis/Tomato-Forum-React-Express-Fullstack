import { combineReducers } from "redux";

export const TotalSectionState = {
  POST: "POST",
  USER: "USER",
  HOT_SERACH: "HOT_SEARCH",
  PERMIT: "PERMIT",
  NONE: "NONE",
};

const globalInitialState = {
  sectionState: TotalSectionState.NONE,
};

export const actionsType = {
  CHANGE_SECTION_STATE: "CHANGE_SECTION_STATE",
};

export const actions = {
  change_section_state(sectionState) {
    return {
      type: actionsType.CHANGE_SECTION_STATE,
      sectionState,
    };
  },
};

export function reducer(globalState = globalInitialState, action) {
  switch (action.type) {
    case actionsType.CHANGE_SECTION_STATE:
      return {
        ...globalInitialState,
        sectionState: action.sectionState,
      };
    default:
      return globalState;
  }
}

export default combineReducers({
  globalState: reducer,
});
