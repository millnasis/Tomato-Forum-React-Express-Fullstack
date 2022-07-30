import { put, take, call } from "redux-saga/effects";
import axios from "axios";
import { actions as rootActions } from "../reducers/root";
import { actions, actionsType } from "../reducers/post";
const { start_fetch, end_fetch, set_message } = rootActions;
const {} = actions;

function* sendToGetPostArray(pagination, query) {
  yield put(start_fetch());
  try {
    return yield call(axios.get, "/api/admin/query/post", {
      params: { ...pagination, ...query },
    });
  } catch (error) {
    yield put(set_message(2, "获取错误"));
  } finally {
    yield put(end_fetch());
  }
}

export function* getPostArray() {
  while (true) {
    const action = yield take(
      actionsType.SEND_TO_GET_BACKGROUND_POST_SHOW_ARRAY
    );
    const { pagination, query } = action;
    const response = yield call(sendToGetPostArray, pagination, query);
    if (response && response.status === 200) {
      yield put(actions.response_background_post_show_array(response.data));
    }
  }
}

export function* updatePost() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_UPDATE_SINGLE_POST);
    const { id, obj, query, pagination } = action;
    const response = yield call(axios.post, "/api/admin/update/post", {
      id,
      obj,
      query,
      pagination,
    });
    if (response && response.status === 200) {
      yield put(actions.response_background_post_show_array(response.data));
    } else {
      yield put(rootActions.set_message(2, "修改错误"));
    }
  }
}
export function* deletePost() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_DELETE_SINGLE_POST);
    const { id, query, pagination } = action;
    const response = yield call(axios.post, "/api/admin/delete/post", {
      id,
      query,
      pagination,
    });
    if (response && response.status === 200) {
      yield put(actions.response_background_post_show_array(response.data));
    } else {
      yield put(rootActions.set_message(2, "修改错误"));
    }
  }
}
