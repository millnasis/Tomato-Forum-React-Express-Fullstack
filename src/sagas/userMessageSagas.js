import { put, take, call } from "redux-saga/effects";
import axios from "axios";

import { actions, actionsType } from "../reducers/userMessagePage";
import {
  actionsType as rootActionsType,
  actions as rootActions,
} from "../reducers/root";

function* sendToGetMessageArray(userid, MSGtype, skip) {
  try {
    return yield call(axios.get, `/api/message/user/${userid}`, {
      params: { MSGtype, skip, limit: 10 },
    });
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取错误"));
  }
}

export function* getMessageArray() {
  while (true) {
    let action = yield take(actionsType.SEND_TO_GET_SHOW_MESSAGE_ARRAY);
    const { userid, messageType, skip } = action;
    let response = yield call(sendToGetMessageArray, userid, messageType, skip);
    if (response && response.status === 200) {
      yield put(actions.response_show_message_array(response.data));
    }
  }
}
