import { fork } from "redux-saga/effects";
import * as post from "./post";
import * as reply from "./reply";
import * as user from "./user";

export default function* rootSaga() {
  yield fork(post.getPostArray);
  yield fork(post.updatePost);
  yield fork(post.deletePost);
  yield fork(reply.getReplyArray);
  yield fork(reply.updateReply);
  yield fork(reply.deleteReply);
  yield fork(reply.deleteComment);
  yield fork(user.getUserArray);
  yield fork(user.updateUser);
  yield fork(user.deleteUser);
}
