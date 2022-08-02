import { put, take, call } from "redux-saga/effects";
import axios from "axios";
import { actions as rootActions } from "../reducers/root";
import { actions, actionsType } from "../reducers/user";
const { start_fetch, end_fetch, set_message } = rootActions;

function* sendToGetUserArray(pagination, query) {
  yield put(start_fetch());
  try {
    return yield call(axios.get, "/api/admin/user", {
      params: { ...pagination, ...query },
    });
  } catch (error) {
    yield put(set_message(2, "获取错误"));
  } finally {
    yield put(end_fetch());
  }
}

export function* getUserArray() {
  while (true) {
    const action = yield take(
      actionsType.SEND_TO_GET_BACKGROUND_USER_SHOW_ARRAY
    );
    const { pagination, query } = action;
    const response = yield call(sendToGetUserArray, pagination, query);
    if (response && response.status === 200) {
      yield put(actions.response_background_user_show_array(response.data));
    }
  }
}

export function* updateUser() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_UPDATE_SINGLE_USER);
    const { id, obj, query, pagination } = action;
    const response = yield call(axios.post, "/api/admin/user", {
      id,
      obj,
      query,
      pagination,
    });
    if (response && response.status === 200) {
      yield put(actions.response_background_user_show_array(response.data));
    } else {
      yield put(rootActions.set_message(2, "修改错误"));
    }
  }
}
export function* deleteUser() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_DELETE_SINGLE_USER);
    const { id, query, pagination } = action;
    const response = yield call(axios.delete, "/api/admin/user", {
      data: {
        id,
        query,
        pagination,
      },
    });
    if (response && response.status === 200) {
      yield put(actions.response_background_user_show_array(response.data));
    } else {
      yield put(rootActions.set_message(2, "删除失败"));
    }
  }
}
