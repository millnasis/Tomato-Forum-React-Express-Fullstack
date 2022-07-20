import { put, take, call } from "redux-saga/effects";
import axios from "axios";

import { actions, actionsType } from "../reducers/userInfoPage";
import {
  actionsType as rootActionsType,
  actions as rootActions,
} from "../reducers/root";

function* sendToGetUserInfo(userid) {
  yield put(rootActions.start_fetch());
  try {
    return yield call(axios.get, `/api/user/${userid}`);
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取错误"));
  } finally {
    yield put(rootActions.end_fetch());
  }
}

export function* getUserInfo() {
  while (true) {
    let action = yield take(actionsType.SEND_TO_GET_SHOW_USER_INFO);
    let response = yield call(sendToGetUserInfo, action.userid);
    if (response && response.status === 200) {
      yield put(actions.response_user_info(response.data));
    }
  }
}

function* sendToPostUserInfo(userid, userInfo) {
  yield put(actions.start_fetch());
  try {
    return yield call(axios.post, `/api/user/${userid}`, {
      userInfo: userInfo,
    });
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取错误"));
  } finally {
    yield put(actions.end_fetch());
  }
}

export function* updateUserInfo() {
  while (true) {
    let action = yield take(actionsType.SEND_TO_UPDATE_USER_INFO);
    let response = yield call(
      sendToPostUserInfo,
      action.userid,
      action.userInfo
    );
    if (response && response.status === 200) {
      yield put(actions.response_user_info(response.data));
      yield put(rootActions.update_user_info(response.data.userInfo));
      yield put(actions.close_editor());
    }
  }
}

function* sendToGetUserPostArray(publisher, skip) {
  try {
    return yield call(axios.get, `/api/post/user/${publisher}/post`, {
      params: { skip, limit: 10 },
    });
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取发帖错误"));
  }
}
function* sendToGetUserReplyArray(publisher, skip) {
  try {
    return yield call(axios.get, `/api/post/user/${publisher}/reply`, {
      params: { skip, limit: 10 },
    });
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取回复错误"));
  }
}
function* sendToGetUserCommentArray(publisher, skip) {
  try {
    return yield call(axios.get, `/api/post/user/${publisher}/comment`, {
      params: { skip, limit: 10 },
    });
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取评论错误"));
  }
}
function* sendToGetUserFavoriteArray(publisher, skip) {
  try {
    return yield call(axios.get, `/api/favorite/user/${publisher}`, {
      params: { skip, limit: 10 },
    });
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取收藏错误"));
  }
}
function* sendToGetUserFollowWhoArray(userid, skip) {
  try {
    return yield call(axios.get, `/api/follow/query/group/follow/${userid}`, {
      params: { skip, limit: 10 },
    });
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取关注列表错误"));
  }
}
function* sendToGetWhoFollowUserArray(userid, skip) {
  try {
    return yield call(axios.get, `/api/follow/query/group/befollow/${userid}`, {
      params: { skip, limit: 10 },
    });
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取关注列表错误"));
  }
}

export function* getUserPostArray() {
  while (true) {
    let action = yield take(actionsType.SEND_TO_GET_SHOW_USER_POST_ARRAY);
    let response = yield call(
      sendToGetUserPostArray,
      action.publisher,
      action.skip
    );
    if (response && response.status === 200) {
      yield put(actions.response_user_post_array(response.data));
    }
  }
}
export function* getUserReplyArray() {
  while (true) {
    let action = yield take(actionsType.SEND_TO_GET_SHOW_USER_REPLY_ARRAY);
    let response = yield call(
      sendToGetUserReplyArray,
      action.publisher,
      action.skip
    );
    if (response && response.status === 200) {
      yield put(actions.response_user_reply_array(response.data));
    }
  }
}
export function* getUserCommentArray() {
  while (true) {
    let action = yield take(actionsType.SEND_TO_GET_SHOW_USER_COMMENT_ARRAY);
    let response = yield call(
      sendToGetUserCommentArray,
      action.publisher,
      action.skip
    );
    if (response && response.status === 200) {
      yield put(actions.response_user_comment_array(response.data));
    }
  }
}
export function* getUserFavoriteArray() {
  while (true) {
    let action = yield take(actionsType.SEND_TO_GET_SHOW_USER_FAVORITE_ARRAY);
    let response = yield call(
      sendToGetUserFavoriteArray,
      action.publisher,
      action.skip
    );
    if (response && response.status === 200) {
      yield put(actions.response_user_favorite_array(response.data));
    }
  }
}

export function* getUserFollowWhoArray() {
  while (true) {
    const action = yield take(actionsType.SEND_TO_GET_SHOW_USER_FOLLOW_ARRAY);
    const response = yield call(
      sendToGetUserFollowWhoArray,
      action.userid,
      action.skip
    );
    if (response && response.status === 200) {
      yield put(actions.response_user_follow_array(response.data));
    }
  }
}
export function* getWhoFollowUserArray() {
  while (true) {
    const action = yield take(
      actionsType.SEND_TO_GET_SHOW_WHO_FOLLOW_USER_ARRAY
    );
    const response = yield call(
      sendToGetWhoFollowUserArray,
      action.userid,
      action.skip
    );
    if (response && response.status === 200) {
      yield put(actions.response_who_follow_user_array(response.data));
    }
  }
}
