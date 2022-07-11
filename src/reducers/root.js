import { combineReducers } from "redux";
import { reducer as UIreducer } from "./ui";
import { reducer as UserInfoPageReducer } from "./userInfoPage";
import { reducer as MainIndexPageReducer } from "./mainIndexPage";
import { reducer as PostContentPageReducer } from "./postContentPage";
import { reducer as UserMessagePageReducer } from "./userMessagePage";
import { reducer as SearchPageReducer } from "./searchPage";

const globalInitialState = {
  isFetching: false,
  isUserInfoFetching: false,
  isUserLogin: false,
  message: {
    type: -1,
    content: null,
  },
  userInfo: {},
  reload: false,
};

export const actionsType = {
  FETCH_START: "FETCH_START",
  FETCH_END: "FETCH_END",
  SET_MESSAGE: "SET_MESSAGE",
  CLEAR_MESSAGE: "CLEAR_MESSAGE",
  USER_SEND_LOGIN: "USER_SEND_LOGIN",
  USER_SEND_REGISTER: "USER_SEND_REGISTER",
  USER_GRANT_LOGIN: "USER_GRANT_LOGIN",
  USER_GRANT_REGISTER: "USER_GRANT_REGISTER",
  USER_SEND_LOGOUT: "USER_SEND_LOGOUT",
  USER_GRANT_LOGOUT: "USER_GRANT_LOGOUT",
  USER_SEND_UPDATE_INFO: "USER_SEND_UPDATE_INFO",
  UPDATE_USER_INFO: "UPDATE_USER_INFO",
  RELOAD_PAGE: "RELOAD_PAGE",
  FAILED_TO_UPDATE_USER_INFO: "FAILED_TO_UPDATE_USER_INFO",
};

export const actions = {
  send_login(username, password) {
    return {
      type: actionsType.USER_SEND_LOGIN,
      username,
      password,
    };
  },
  send_register(data) {
    return {
      type: actionsType.USER_SEND_REGISTER,
      data,
    };
  },
  send_logout() {
    return {
      type: actionsType.USER_SEND_LOGOUT,
    };
  },
  grant_login(userInfo) {
    return {
      type: actionsType.USER_GRANT_LOGIN,
      userInfo,
    };
  },
  grant_logout() {
    return {
      type: actionsType.USER_GRANT_LOGOUT,
    };
  },
  grant_register(userInfo) {
    return {
      type: actionsType.USER_GRANT_REGISTER,
      userInfo,
    };
  },
  send_update_user_info() {
    return {
      type: actionsType.USER_SEND_UPDATE_INFO,
    };
  },
  update_user_info(userInfo) {
    return {
      type: actionsType.UPDATE_USER_INFO,
      userInfo,
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
  /**
   * 
   * @param {int} type 消息类型，1为成功，2为错误，3为警告
   * @param {String} content 消息内容
   * @returns 
   */
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
};

export function reducer(globalState = globalInitialState, action) {
  switch (action.type) {
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
    case actionsType.USER_SEND_UPDATE_INFO:
      return {
        ...globalState,
        isUserInfoFetching: true,
      };
    case actionsType.UPDATE_USER_INFO:
      return {
        ...globalState,
        userInfo: action.userInfo,
        isUserInfoFetching: false,
        isUserLogin: true,
      };
    case actionsType.USER_GRANT_LOGIN:
      return {
        ...globalState,
        isUserLogin: true,
        userInfo: action.userInfo,
      };
    case actionsType.USER_GRANT_REGISTER:
      return {
        ...globalState,
        isUserLogin: true,
        userInfo: action.userInfo,
      };
    case actionsType.USER_GRANT_LOGOUT:
      return {
        ...globalState,
        isUserLogin: false,
        userInfo: {},
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
    case actionsType.RELOAD_PAGE:
      return {
        ...globalState,
        reload: true,
      };
    case actionsType.FAILED_TO_UPDATE_USER_INFO:
      return {
        ...globalState,
        isUserInfoFetching: false,
      };
    default:
      return globalState;
  }
}

export default combineReducers({
  globalState: reducer,
  UIState: UIreducer,
  userInfoPageState: UserInfoPageReducer,
  mainIndexPageState: MainIndexPageReducer,
  postContentPageState: PostContentPageReducer,
  userMessagePageState: UserMessagePageReducer,
  searchPageState: SearchPageReducer,
});
