import { put, take, call } from "redux-saga/effects";
import axios from "axios";

import { actions, actionsType } from "../reducers/searchPage";
import {
  actionsType as rootActionsType,
  actions as rootActions,
} from "../reducers/root";

const singlePageLimit = 10;

function* sendToGetShowArray(keyword, searchTarget, sortMode, skip) {
  yield put(rootActions.start_fetch());
  try {
    return yield call(axios.get, `/api/search`, {
      params: { keyword, searchTarget, sortMode, skip, limit: singlePageLimit },
    });
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取错误"));
  } finally {
    yield put(rootActions.end_fetch());
  }
}

export function* getShowArray() {
  while (true) {
    let action = yield take(actionsType.SEND_TO_SEARCH_GET_SHOW_ARRAY);
    const { keyword, searchTarget, sortMode, skip } = action;
    if (!keyword) {
      yield put(actions.response_show_array({ arr: [], sum: 0 }));
    } else {
      let response = yield call(
        sendToGetShowArray,
        keyword,
        searchTarget,
        sortMode,
        skip
      );
      if (response && response.status === 200) {
        yield put(actions.response_show_array(response.data));
      }
    }
  }
}
