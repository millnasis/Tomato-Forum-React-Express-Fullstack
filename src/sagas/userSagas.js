import { put, take, call } from "redux-saga/effects";
import axios from "axios";

import { actionsType, actions } from "../reducers/root";
import {
  actionsType as UIactionsType,
  actions as UIactions,
} from "../reducers/ui";
import { actionsType as userInfoPageActionsType } from "../reducers/userInfoPage";
import { consoleDebugTool } from "../tools/consoleDebugTool";

function* loginSend(username, password) {
  yield put(UIactions.start_fetch());
  try {
    return yield call(axios.post, "/api/user/login", { username, password });
  } catch (error) {
    if (error.response.data === "username") {
      yield put({ type: UIactionsType.USER_LOGIN_USERNAME_ERROR });
    } else if (error.response.data === "password") {
      yield put({ type: UIactionsType.USER_LOGIN_PASSWORD_ERROR });
    }
  } finally {
    yield put(UIactions.end_fetch());
  }
}

export function* checkLogin() {
  while (true) {
    let loginData = yield take(actionsType.USER_SEND_LOGIN);
    let response = yield call(
      loginSend,
      loginData.username,
      loginData.password
    );
    if (response && response.status === 200) {
      yield put(actions.grant_login(response.data));
      yield put(UIactions.close_login_modal());
      yield put({ type: actionsType.RELOAD_PAGE });
    }
  }
}

function* registerSend(data) {
  yield put(UIactions.start_fetch());
  try {
    return yield call(axios.post, "/api/user/register", data);
  } catch (error) {
    if (error.response.data === "userexist") {
      yield put({ type: UIactionsType.USER_REGISTER_USERNAME_EXIST_ERROR });
    }
  } finally {
    yield put(UIactions.end_fetch());
  }
}

export function* checkRegister() {
  while (true) {
    let registerData = yield take(actionsType.USER_SEND_REGISTER);
    let response = yield call(registerSend, registerData.data);
    if (response && response.status === 200) {
      yield put(actions.grant_register(response.data));
      yield put(UIactions.close_login_modal());
    }
  }
}

function* updateSend() {
  yield put(actions.start_fetch());
  try {
    return yield call(axios.get, "/api/user");
  } catch (error) {
  } finally {
    yield put(actions.end_fetch());
  }
}

export function* updateUserInfo() {
  while (true) {
    yield take(actionsType.USER_SEND_UPDATE_INFO);
    let response = yield call(updateSend);
    if (response && response.status === 200) {
      consoleDebugTool("userSagas", response.data);
      yield put(actions.update_user_info(response.data));
    } else {
      yield put({ type: actionsType.FAILED_TO_UPDATE_USER_INFO });
    }
  }
}

function* logoutSend() {
  yield put(actions.start_fetch());
  try {
    return yield call(axios.post, "/api/user/logout");
  } catch (error) {
    return yield put(actions.set_message(2, "获取错误"));
  } finally {
    yield put(actions.end_fetch());
  }
}

export function* logout() {
  while (true) {
    yield take(actionsType.USER_SEND_LOGOUT);
    let response = yield call(logoutSend);
    if (response && response.status === 200) {
      yield put(actions.grant_logout());
      yield put({ type: actionsType.RELOAD_PAGE });
      yield put({ type: userInfoPageActionsType.USER_INFO_PAGE_LOG_OUT });
    }
  }
}

export function* queryFollow() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_QUERY_FOLLOW);
    const { userFrom, userTo } = action;
    const response = yield call(axios.get, "/api/follow/query/single", {
      params: { userFrom, userTo },
    });
    if (response && response.status === 200) {
      yield put(actions.response_follow(response.data));
    } else {
      yield put(actions.set_message(2, "获取关注信息错误"));
    }
  }
}

export function* sendFollow() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_FOLLOW);
    const { userid } = action;
    const response = yield call(axios.post, `/api/follow/add/${userid}`);
    if (response && response.status === 200) {
      yield put(actions.reset_follow(true));
    } else {
      yield put(actions.set_message(2, "关注失败"));
    }
  }
}

export function* sendUnfollow() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_UNFOLLOW);
    const { userid } = action;
    const response = yield call(axios.post, `/api/follow/delete/${userid}`);
    if (response && response.status === 200) {
      yield put(actions.reset_follow(false));
    } else {
      yield put(actions.set_message(2, "取消关注失败"));
    }
  }
}
