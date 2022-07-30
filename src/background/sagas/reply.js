import { put, take, call } from "redux-saga/effects";
import axios from "axios";
import { actions as rootActions } from "../reducers/root";
import { actions, actionsType } from "../reducers/reply";
const { start_fetch, end_fetch, set_message } = rootActions;
const {} = actions;

function* sendToGetReplyArray(pagination, query) {
  yield put(start_fetch());
  try {
    return yield call(axios.get, "/api/admin/reply", {
      params: { ...pagination, ...query },
    });
  } catch (error) {
    yield put(set_message(2, "获取错误"));
  } finally {
    yield put(end_fetch());
  }
}

export function* getReplyArray() {
  while (true) {
    const action = yield take(
      actionsType.SEND_TO_GET_BACKGROUND_REPLY_SHOW_ARRAY
    );
    const { pagination, query } = action;
    const response = yield call(sendToGetReplyArray, pagination, query);
    if (response && response.status === 200) {
      yield put(actions.response_background_reply_show_array(response.data));
    }
  }
}

export function* updateReply() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_UPDATE_SINGLE_REPLY);
    const { id, obj, query, pagination } = action;
    const response = yield call(axios.post, "/api/admin/reply", {
      id,
      obj,
      query,
      pagination,
    });
    if (response && response.status === 200) {
      yield put(actions.response_background_reply_show_array(response.data));
    } else {
      yield put(rootActions.set_message(2, "修改错误"));
    }
  }
}
export function* deleteReply() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_DELETE_SINGLE_REPLY);
    const { id, query, pagination } = action;
    const response = yield call(axios.delete, "/api/admin/reply", {
      data: {
        id,
        query,
        pagination,
      },
    });
    if (response && response.status === 200) {
      yield put(actions.response_background_reply_show_array(response.data));
    } else {
      yield put(rootActions.set_message(2, "修改错误"));
    }
  }
}
