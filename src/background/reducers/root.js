import { combineReducers } from "redux";
import { reducer as postReducer } from "./post";
import { reducer as replyReducer } from "./reply";
import { reducer as userReducer } from "./user";
import { reducer as hotsearchReducer } from "./hotsearch";

export const TotalSectionState = {
  POST: "POST",
  USER: "USER",
  HOT_SERACH: "HOT_SEARCH",
  REPLY: "REPLY",
  NONE: "NONE",
};

const globalInitialState = {
  sectionState: TotalSectionState.NONE,
  message: {
    type: -1,
    content: null,
  },
  reload: false,
};

export const actionsType = {
  CHANGE_SECTION_STATE: "CHANGE_SECTION_STATE",
  SET_MESSAGE: "SET_MESSAGE",
  CLEAR_MESSAGE: "CLEAR_MESSAGE",
  FETCH_START: "FETCH_START",
  FETCH_END: "FETCH_END",
};

export const actions = {
  change_section_state(sectionState) {
    return {
      type: actionsType.CHANGE_SECTION_STATE,
      sectionState,
    };
  },
  set_message(type, content) {
    return {
      type: actionsType.SET_MESSAGE,
      msgtype: type,
      content: content,
    };
  },
  clear_message() {
    return {
      type: actionsType.CLEAR_MESSAGE,
    };
  },
  start_fetch() {
    return {
      type: actionsType.FETCH_START,
    };
  },
  end_fetch() {
    return {
      type: actionsType.FETCH_END,
    };
  },
};

export function reducer(globalState = globalInitialState, action) {
  switch (action.type) {
    case actionsType.CHANGE_SECTION_STATE:
      return {
        ...globalState,
        sectionState: action.sectionState,
      };
    case actionsType.SET_MESSAGE:
      return {
        ...globalState,
        message: {
          type: action.msgtype,
          content: action.content,
        },
      };
    case actionsType.CLEAR_MESSAGE:
      return {
        ...globalState,
        message: {
          type: -1,
          content: null,
        },
      };
    case actionsType.FETCH_START:
      return {
        ...globalState,
        isFetching: true,
      };
    case actionsType.FETCH_END:
      return {
        ...globalState,
        isFetching: false,
      };
    default:
      return globalState;
  }
}

export default combineReducers({
  globalState: reducer,
  postState: postReducer,
  replyState: replyReducer,
  userState: userReducer,
  hotSearchState: hotsearchReducer,
});
