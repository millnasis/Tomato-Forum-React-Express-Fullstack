const UIInitialState = {
  isShowLoginModal: false,
  isLoginModalFetching: false,
  isLoginError: null,
};

export const actionsType = {
  USER_SHOW_LOGIN_MODAL: "USER_SHOW_LOGIN_MODAL",
  USER_CLOSE_LOGIN_MODAL: "USER_CLOSE_LOGIN_MODAL",
  USER_LOGIN_USERNAME_ERROR: "USER_LOGIN_USERNAME_ERROR",
  USER_LOGIN_PASSWORD_ERROR: "USER_LOGIN_PASSWORD_ERROR",
  USER_REGISTER_USERNAME_EXIST_ERROR: "USER_REGISTER_USERNAME_EXIST_ERROR",
  USER_LOGIN_RESET_ERROR: "USER_LOGIN_RESET_ERROR",
  LOGIN_MODAL_FETCH_START: "LOGIN_MODAL_FETCH_START",
  LOGIN_MODAL_FETCH_END: "LOGIN_MODAL_FETCH_END",
};

export const actions = {
  start_fetch() {
    return {
      type: actionsType.LOGIN_MODAL_FETCH_START,
    };
  },
  end_fetch() {
    return {
      type: actionsType.LOGIN_MODAL_FETCH_END,
    };
  },
  show_login_modal() {
    return {
      type: actionsType.USER_SHOW_LOGIN_MODAL,
    };
  },
  close_login_modal() {
    return {
      type: actionsType.USER_CLOSE_LOGIN_MODAL,
    };
  },
  reset_login_error() {
    return {
      type: actionsType.USER_LOGIN_RESET_ERROR,
    };
  },
};

export function reducer(UIstate = UIInitialState, action) {
  switch (action.type) {
    case actionsType.USER_SHOW_LOGIN_MODAL:
      return {
        ...UIstate,
        isShowLoginModal: true,
      };
    case actionsType.USER_CLOSE_LOGIN_MODAL:
      return {
        ...UIstate,
        isShowLoginModal: false,
        isLoginModalFetching: false,
      };
    case actionsType.LOGIN_MODAL_FETCH_START:
      return {
        ...UIstate,
        isLoginModalFetching: true,
      };
    case actionsType.LOGIN_MODAL_FETCH_END:
      return {
        ...UIstate,
        isLoginModalFetching: false,
      };
    case actionsType.USER_LOGIN_USERNAME_ERROR:
      return {
        ...UIstate,
        isLoginError: "username",
      };
    case actionsType.USER_LOGIN_PASSWORD_ERROR:
      return {
        ...UIstate,
        isLoginError: "password",
      };
    case actionsType.USER_LOGIN_RESET_ERROR:
      return {
        ...UIstate,
        isLoginError: null,
      };
    case actionsType.USER_REGISTER_USERNAME_EXIST_ERROR:
      return {
        ...UIstate,
        isLoginError:"userexist"
      }
    default:
      return UIstate;
  }
}
