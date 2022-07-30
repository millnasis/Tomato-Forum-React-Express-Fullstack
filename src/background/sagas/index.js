import { fork } from "redux-saga/effects";
import * as post from "./post";
import * as reply from "./reply";

export default function* rootSaga() {
  yield fork(post.getPostArray);
  yield fork(post.updatePost);
  yield fork(post.deletePost);
  yield fork(reply.getReplyArray);
}
