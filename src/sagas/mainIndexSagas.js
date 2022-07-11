import { put, take, call } from "redux-saga/effects";
import axios from "axios";

import { actions, actionsType } from "../reducers/mainIndexPage";
import {
  actionsType as rootActionsType,
  actions as rootActions,
} from "../reducers/root";

function* sendToGetHotPostArray(skip, limit) {
  yield put(actions.start_hot_array_fetch());
  try {
    return yield call(axios.get, "/api/post/recommend/hot", {
      params: { skip: skip, limit: limit },
    });
  } catch (error) {
    if (error.response.status === 404) {
      yield put(rootActions.set_message(3, "已无更多内容"));
    } else {
      yield put(rootActions.set_message(2, "获取错误"));
    }
    return yield put(actions.response_hot_post_array([]));
  } finally {
    yield put(actions.end_hot_array_fetch());
  }
}

export function* getHotPostArray() {
  while (true) {
    let data = yield take(actionsType.SEND_TO_GET_HOT_POST_ARRAY);
    let response = yield call(sendToGetHotPostArray, data.skip, data.limit);
    if (response && response.status === 200) {
      yield put(actions.response_hot_post_array(response.data));
    }
  }
}

function* sendToGetNewPostArray(skip, limit) {
  yield put(actions.start_new_array_fetch());
  try {
    return yield call(axios.get, "/api/post/recommend/new", {
      params: { skip: skip, limit: limit },
    });
  } catch (error) {
    if (error.response.status === 404) {
      yield put(rootActions.set_message(3, "已无更多内容"));
    } else {
      yield put(rootActions.set_message(2, "获取错误"));
    }
    return yield put(actions.response_new_post_array([]));
  } finally {
    yield put(actions.end_new_array_fetch());
  }
}

export function* getNewPostArray() {
  while (true) {
    let data = yield take(actionsType.SEND_TO_GET_NEW_POST_ARRAY);
    let response = yield call(sendToGetNewPostArray, data.skip, data.limit);
    if (response && response.status === 200) {
      yield put(actions.response_new_post_array(response.data));
    }
  }
}

function* sendToGetHotSearchArray() {
  try {
    return yield call(axios.get, "/api/search/hot");
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取热搜错误"));
  }
}

export function* getHotSearchArray() {
  while (true) {
    let data = yield take(actionsType.SEND_TO_GET_HOT_SEARCH);
    let response = yield call(sendToGetHotSearchArray);
    if (response && response.status === 200) {
      yield put(actions.response_hot_search(response.data));
    }
  }
}

function* sendToPublishNewPost(title, content, publisher) {
  yield put(actions.start_publish_post_fetch());
  try {
    return yield call(axios.put, "/api/post", { title, content, publisher });
  } catch (error) {
    console.log(error);
    return yield put(rootActions.set_message(2, "发帖错误"));
  } finally {
    yield put(actions.end_publish_post_fetch());
  }
}

export function* publishNewPost() {
  while (true) {
    let data = yield take(actionsType.USER_PUBLISH_NEW_POST);
    const { title, content, publisher } = data;
    let response = yield call(sendToPublishNewPost, title, content, publisher);
    if (response && response.status === 200) {
      yield put(rootActions.set_message(1, "发布成功"));
      yield put({ type: rootActionsType.RELOAD_PAGE });
    }
  }
}
