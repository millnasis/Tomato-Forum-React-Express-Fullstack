import { fork } from "redux-saga/effects";

import { checkLogin, checkRegister, logout, updateUserInfo } from "./userSagas";
import * as userInfoPage from "./userInfoPageSagas";
import * as mainIndexPage from "./mainIndexSagas";
import * as postContentPage from "./postContentSagas";
import * as userMessagePage from "./userMessageSagas";
import * as searchPage from "./searchPageSagas";

export default function* rootSaga() {
  yield fork(checkLogin);
  yield fork(checkRegister);
  yield fork(logout);
  yield fork(updateUserInfo);
  yield fork(userInfoPage.getUserInfo);
  yield fork(userInfoPage.updateUserInfo);
  yield fork(userInfoPage.getUserPostArray);
  yield fork(userInfoPage.getUserReplyArray);
  yield fork(userInfoPage.getUserCommentArray);
  yield fork(userInfoPage.getUserFavoriteArray);
  yield fork(mainIndexPage.getHotPostArray);
  yield fork(mainIndexPage.getHotSearchArray);
  yield fork(mainIndexPage.getNewPostArray);
  yield fork(mainIndexPage.publishNewPost);
  yield fork(mainIndexPage.getClickPostArray);
  yield fork(postContentPage.getPostContentBody);
  yield fork(postContentPage.getShowReplyArray);
  yield fork(postContentPage.putNewReply);
  yield fork(postContentPage.putNewComment);
  yield fork(postContentPage.postLike);
  yield fork(postContentPage.postFavorite);
  yield fork(userMessagePage.getMessageArray);
  yield fork(searchPage.getShowArray);
}
