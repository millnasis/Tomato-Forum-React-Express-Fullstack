import { fork } from "redux-saga/effects";
import * as post from "./post";

export default function* rootSaga() {
  yield fork(post.getPostArray);
}
