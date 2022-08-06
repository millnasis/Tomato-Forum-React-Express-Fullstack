import { put, take, call } from "redux-saga/effects";
import axios from "axios";
import { actions as rootActions } from "../reducers/root";
import { actions, actionsType } from "../reducers/hotsearch";
const { start_fetch, end_fetch, set_message } = rootActions;

function* sendToGetHotSearchNormalArray(pagination, query) {
  yield put(start_fetch());
  try {
    return yield call(axios.get, "/api/admin/hotsearch/normal", {
      params: { ...pagination, ...query },
    });
  } catch (error) {
    yield put(set_message(2, "获取错误"));
  } finally {
    yield put(end_fetch());
  }
}

export function* getHotSearchNormalArray() {
  while (true) {
    const action = yield take(
      actionsType.SEND_TO_GET_BACKGROUND_HOT_SEARCH_SHOW_NORMAL_ARRAY
    );
    const { pagination, query } = action;
    const response = yield call(
      sendToGetHotSearchNormalArray,
      pagination,
      query
    );
    if (response && response.status === 200) {
      yield put(
        actions.response_background_hot_search_show_normal_array(response.data)
      );
    }
  }
}

export function* getHotSearchControlArray() {
  while (true) {
    yield take(
      actionsType.SEND_TO_GET_BACKGROUND_HOT_SEARCH_SHOW_CONTROL_ARRAY
    );
    const response = yield call(axios.get, "/api/admin/hotsearch/control");
    if (response && response.status === 200) {
      yield put(
        actions.response_background_hot_search_show_control_array(response.data)
      );
    }
  }
}

export function* updateHotNormalSearch() {
  while (true) {
    const action = yield take(
      actionsType.SEND_TO_UPDATE_SINGLE_NORMAL_HOT_SEARCH
    );
    const { id, obj, query, pagination } = action;
    const response = yield call(axios.post, "/api/admin/hotsearch/normal", {
      id,
      obj,
      query,
      pagination,
    });
    if (response && response.status === 200) {
      yield put(
        actions.response_background_hot_search_show_normal_array(response.data)
      );
    } else {
      yield put(rootActions.set_message(2, "修改错误"));
    }
  }
}

export function* addNormalHotSearch() {
  while (true) {
    try {
      const action = yield take(
        actionsType.SEND_TO_ADD_SINGLE_NORMAL_HOT_SEARCH
      );
      const { obj, query, pagination } = action;
      const response = yield call(axios.put, "/api/admin/hotsearch/normal", {
        obj,
        pagination,
        query,
      });
      if (response && response.status === 200) {
        yield put(
          actions.response_background_hot_search_show_normal_array(
            response.data
          )
        );
      }
    } catch (error) {
      yield put(rootActions.set_message(2, "新增错误，可能是关键词已经存在"));
    }
  }
}

export function* deleteNormalHotSearch() {
  while (true) {
    try {
      const action = yield take(
        actionsType.SEND_TO_DELETE_SINGLE_NORMAL_HOT_SEARCH
      );
      const { id, query, pagination } = action;
      const response = yield call(axios.delete, "/api/admin/hotsearch/normal", {
        data: {
          id,
          query,
          pagination,
        },
      });
      if (response && response.status === 200) {
        yield put(
          actions.response_background_hot_search_show_normal_array(
            response.data
          )
        );
      }
    } catch (error) {
      yield put(rootActions.set_message(2, "删除失败"));
    }
  }
}
