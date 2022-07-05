import { put, take, call } from "redux-saga/effects";
import axios from "axios";

import { actionsType, actions } from "../reducers/root";
import {
  actionsType as UIactionsType,
  actions as UIactions,
} from "../reducers/ui";
import { actionsType as userInfoPageActionsType } from "../reducers/userInfoPage";

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
