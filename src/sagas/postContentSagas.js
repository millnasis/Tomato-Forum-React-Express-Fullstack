import { put, take, call } from "redux-saga/effects";
import axios from "axios";

import { actions, actionsType } from "../reducers/postContentPage";
import {
  actions as rootActions,
  actionsType as RootActionsType,
} from "../reducers/root";

function* sendToGetPostContentBody(postid, click) {
  yield put(rootActions.start_fetch());
  try {
    return yield call(axios.get, `/api/post/${postid}/main`, {
      params: { click },
    });
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取错误"));
  } finally {
    yield put(rootActions.end_fetch());
  }
}

export function* getPostContentBody() {
  while (true) {
    let action = yield take(actionsType.SEND_TO_GET_POST_CONTENT_BODY);
    let response = yield call(
      sendToGetPostContentBody,
      action.postid,
      action.click
    );
    if (response && response.status === 200) {
      yield put(actions.response_post_content_body(response.data));
    }
  }
}

function* sendToGetShowReplyArray(postid, skip, limit) {
  try {
    return yield call(axios.get, `/api/post/${postid}/reply`, {
      params: { skip, limit },
    });
  } catch (error) {
    return yield put(rootActions.set_message(2, "获取回复错误"));
  }
}

export function* getShowReplyArray() {
  while (true) {
    let action = yield take(actionsType.SEND_TO_GET_SHOW_REPLY_ARRAY);
    const { postid, skip, limit } = action;
    let response = yield call(sendToGetShowReplyArray, postid, skip, limit);
    if (response && response.status === 200) {
      yield put(actions.response_show_reply_array(response.data));
    }
  }
}

function* sendToPutNewReply(postid, publisher, content) {
  yield put(actions.start_fetch_post_new_reply());
  try {
    return yield call(axios.put, `/api/post/${postid}/reply`, {
      publisher,
      content,
    });
  } catch (error) {
    yield put(rootActions.set_message(2, "发布错误"));
  } finally {
    yield put(actions.end_fetch_post_new_reply());
  }
}

export function* putNewReply() {
  while (true) {
    let action = yield take(actionsType.USER_SENT_TO_POST_NEW_REPLY);
    const { postid, publisher, content } = action;
    let response = yield call(sendToPutNewReply, postid, publisher, content);
    if (response && response.status === 200) {
      yield put(rootActions.set_message(1, "发布成功"));
      yield put(actions.response_post_new_reply());
    }
  }
}

function* sendToPutNewComment(
  replyID,
  publisher,
  content,
  isMention,
  mentionID,
  mentionUser
) {
  yield put(actions.start_fetch_post_new_reply());
  try {
    return yield call(axios.put, `/api/post/reply/${replyID}/comment`, {
      publisher,
      content,
      isMention,
      mentionID,
      mentionUser,
    });
  } catch (error) {
    yield put(rootActions.set_message(2, "发布错误"));
  } finally {
    yield put(actions.end_fetch_post_new_reply());
  }
}

export function* putNewComment() {
  while (true) {
    let action = yield take(actionsType.USER_SENT_TO_POST_NEW_COMMENT);
    const { replyID, publisher, content, isMention, mentionID, mentionUser } =
      action;
    let response = yield call(
      sendToPutNewComment,
      replyID,
      publisher,
      content,
      isMention,
      mentionID,
      mentionUser
    );
    if (response && response.status === 200) {
      yield put(rootActions.set_message(1, "发布成功"));
      yield put(actions.response_post_new_comment(response.data));
    }
  }
}

function* sendToPostLike(target, id, publisher) {
  try {
    if (target === "post") {
      return yield call(axios.post, `/api/post/${id}/like`, { publisher });
    } else if (target === "reply") {
      return yield call(axios.post, `/api/post/reply/${id}/like`, {
        publisher,
      });
    }
  } catch (error) {
    yield put(rootActions.set_message(2, "点赞失败"));
  }
}

export function* postLike() {
  while (true) {
    let action = yield take(actionsType.USER_SEND_TO_LIKE);
    const { target, id, publisher } = action;
    let response = yield call(sendToPostLike, target, id, publisher);
    if (response && response.status === 200) {
      yield put(actions.response_send_to_like(target, response.data));
    }
  }
}

function* sendToPostFavorite(userid, postid) {
  try {
    return yield call(
      axios.post,
      `/api/favorite/user/${userid}/post/${postid}`
    );
  } catch (error) {
    yield put(rootActions.set_message(2, "收藏失败"));
  }
}

export function* postFavorite() {
  while (true) {
    let action = yield take(actionsType.USER_SEND_TO_FAVORITE);
    const { userid, postid } = action;
    let response = yield call(sendToPostFavorite, userid, postid);
    if (response && response.status === 200) {
      yield put(actions.get_post_content_body(postid));
    }
  }
}
