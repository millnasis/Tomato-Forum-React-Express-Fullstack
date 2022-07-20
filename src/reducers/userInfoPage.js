const initialState = {
  showUserInfo: {},
  userInteractData: {},
  showUserPostArray: [],
  showUserPostArraySum: 20,
  showUserReplyArray: [],
  showUserReplyArraySum: 0,
  showUserCommentArray: [],
  showUserCommentArraySum: 0,
  showUserFavoriteArray: [],
  showUserFavoriteArraySum: 0,
  showUserFollowArray: [],
  showUserFollowArraySum: 0,
  showWhoFollowUserArray: [],
  showWhoFollowUserArraySum: 0,
  isEditorFetching: false,
  isShowEditor: false,
  isMe: false,
};

export const actionsType = {
  USER_OPEN_INFO_EDITOR: "USER_OPEN_INFO_EDITOR",
  USER_CLOSE_INFO_EDITOR: "USER_CLOSE_INFO_EDITOR",
  SEND_TO_GET_SHOW_USER_INFO: "SEND_TO_GET_SHOW_USER_INFO",
  SEND_TO_UPDATE_USER_INFO: "SEND_TO_UPDATE_USER_INFO",
  SEND_TO_GET_SHOW_USER_POST_ARRAY: "SEND_TO_GET_SHOW_USER_POST_ARRAY",
  SEND_TO_GET_SHOW_USER_REPLY_ARRAY: "SEND_TO_GET_SHOW_USER_REPLY_ARRAY",
  SEND_TO_GET_SHOW_USER_COMMENT_ARRAY: "SEND_TO_GET_SHOW_USER_COMMENT_ARRAY",
  SEND_TO_GET_SHOW_USER_FAVORITE_ARRAY: "SEND_TO_GET_SHOW_USER_FAVORITE_ARRAY",
  SEND_TO_GET_SHOW_USER_FOLLOW_ARRAY: "SEND_TO_GET_SHOW_USER_FOLLOW_ARRAY",
  SEND_TO_GET_SHOW_WHO_FOLLOW_USER_ARRAY:
    "SEND_TO_GET_SHOW_WHO_FOLLOW_USER_ARRAY",
  RESPONSE_SHOW_USER_INFO: "RESPONSE_SHOW_USER_INFO",
  RESPONSE_SHOW_USER_POST_ARRAY: "RESPONSE_SHOW_USER_POST_ARRAY",
  RESPONSE_SHOW_USER_REPLY_ARRAY: "RESPONSE_SHOW_USER_REPLY_ARRAY",
  RESPONSE_SHOW_USER_COMMENT_ARRAY: "RESPONSE_SHOW_USER_COMMENT_ARRAY",
  RESPONSE_SHOW_USER_FAVORITE_ARRAY: "RESPONSE_SHOW_USER_FAVORITE_ARRAY",
  RESPONSE_SHOW_USER_FOLLOW_ARRAY: "RESPONSE_SHOW_USER_FOLLOW_ARRAY",
  RESONSE_SHOW_WHO_FOLLOW_USER_ARRAY: "RESONSE_SHOW_WHO_FOLLOW_USER_ARRAY",
  START_FETCH_UPDATE_USER_INFO: "START_FETCH_UPDATE_USER_INFO",
  END_FETCH_UPDATE_USER_INFO: "END_FETCH_UPDATE_USER_INFO",
  USER_INFO_PAGE_LOG_OUT: "USER_INFO_PAGE_LOG_OUT",
};

export const actions = {
  get_show_user_info(userid) {
    return {
      type: actionsType.SEND_TO_GET_SHOW_USER_INFO,
      userid: userid,
    };
  },
  get_show_user_post_array(publisher, skip) {
    return {
      type: actionsType.SEND_TO_GET_SHOW_USER_POST_ARRAY,
      publisher,
      skip,
    };
  },
  get_show_user_reply_array(publisher, skip) {
    return {
      type: actionsType.SEND_TO_GET_SHOW_USER_REPLY_ARRAY,
      publisher,
      skip,
    };
  },
  get_show_user_comment_array(publisher, skip) {
    return {
      type: actionsType.SEND_TO_GET_SHOW_USER_COMMENT_ARRAY,
      publisher,
      skip,
    };
  },
  get_show_user_favorite_array(publisher, skip) {
    return {
      type: actionsType.SEND_TO_GET_SHOW_USER_FAVORITE_ARRAY,
      publisher,
      skip,
    };
  },
  get_show_user_follow_array(userid, skip) {
    return {
      type: actionsType.SEND_TO_GET_SHOW_USER_FOLLOW_ARRAY,
      userid,
      skip,
    };
  },
  get_show_who_follow_user_array(userid, skip) {
    return {
      type: actionsType.SEND_TO_GET_SHOW_WHO_FOLLOW_USER_ARRAY,
      userid,
      skip,
    };
  },
  update_user_info(userid, userInfo) {
    return {
      type: actionsType.SEND_TO_UPDATE_USER_INFO,
      userid: userid,
      userInfo: userInfo,
    };
  },
  response_user_info(data) {
    return {
      type: actionsType.RESPONSE_SHOW_USER_INFO,
      showUserInfo: data.userInfo,
      userInteractData: data.userInteractData,
      isMe: data.isMe,
    };
  },
  response_user_post_array(data) {
    return {
      type: actionsType.RESPONSE_SHOW_USER_POST_ARRAY,
      showUserPostArray: data.array,
      showUserPostArraySum: data.sum,
    };
  },
  response_user_reply_array(data) {
    return {
      type: actionsType.RESPONSE_SHOW_USER_REPLY_ARRAY,
      showUserReplyArray: data.array,
      showUserReplyArraySum: data.sum,
    };
  },
  response_user_comment_array(data) {
    return {
      type: actionsType.RESPONSE_SHOW_USER_COMMENT_ARRAY,
      showUserCommentArray: data.array,
      showUserCommentArraySum: data.sum,
    };
  },
  response_user_favorite_array(data) {
    return {
      type: actionsType.RESPONSE_SHOW_USER_FAVORITE_ARRAY,
      showUserFavoriteArray: data.array,
      showUserFavoriteArraySum: data.sum,
    };
  },
  response_user_follow_array(data) {
    return {
      type: actionsType.RESPONSE_SHOW_USER_FOLLOW_ARRAY,
      showUserFollowArray: data.array,
      showUserFollowArraySum: data.sum,
    };
  },
  response_who_follow_user_array(data) {
    return {
      type: actionsType.RESONSE_SHOW_WHO_FOLLOW_USER_ARRAY,
      showWhoFollowUserArray: data.array,
      showWhoFollowUserArraySum: data.sum,
    };
  },
  start_fetch() {
    return {
      type: actionsType.START_FETCH_UPDATE_USER_INFO,
    };
  },
  end_fetch() {
    return {
      type: actionsType.END_FETCH_UPDATE_USER_INFO,
    };
  },
  open_editor() {
    return {
      type: actionsType.USER_OPEN_INFO_EDITOR,
    };
  },
  close_editor() {
    return {
      type: actionsType.USER_CLOSE_INFO_EDITOR,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_SHOW_USER_INFO:
      return {
        ...state,
        showUserInfo: action.showUserInfo,
        userInteractData: action.userInteractData,
        isMe: action.isMe,
      };
    case actionsType.RESPONSE_SHOW_USER_POST_ARRAY:
      return {
        ...state,
        showUserPostArray: action.showUserPostArray,
        showUserPostArraySum: action.showUserPostArraySum,
      };
    case actionsType.RESPONSE_SHOW_USER_REPLY_ARRAY:
      return {
        ...state,
        showUserReplyArray: action.showUserReplyArray,
        showUserReplyArraySum: action.showUserReplyArraySum,
      };
    case actionsType.RESPONSE_SHOW_USER_COMMENT_ARRAY:
      return {
        ...state,
        showUserCommentArray: action.showUserCommentArray,
        showUserCommentArraySum: action.showUserCommentArraySum,
      };
    case actionsType.RESPONSE_SHOW_USER_FAVORITE_ARRAY:
      return {
        ...state,
        showUserFavoriteArray: action.showUserFavoriteArray,
        showUserFavoriteArraySum: action.showUserFavoriteArraySum,
      };
    case actionsType.RESPONSE_SHOW_USER_FOLLOW_ARRAY:
      return {
        ...state,
        showUserFollowArray: action.showUserFollowArray,
        showUserFollowArraySum: action.showUserFollowArraySum,
      };
    case actionsType.RESONSE_SHOW_WHO_FOLLOW_USER_ARRAY:
      return {
        ...state,
        showWhoFollowUserArray: action.showWhoFollowUserArray,
        showWhoFollowUserArraySum: action.showWhoFollowUserArraySum,
      };
    case actionsType.START_FETCH_UPDATE_USER_INFO:
      return {
        ...state,
        isEditorFetching: true,
      };
    case actionsType.END_FETCH_UPDATE_USER_INFO:
      return {
        ...state,
        isEditorFetching: false,
      };
    case actionsType.USER_OPEN_INFO_EDITOR:
      return {
        ...state,
        isShowEditor: true,
      };
    case actionsType.USER_CLOSE_INFO_EDITOR:
      return {
        ...state,
        isShowEditor: false,
      };
    case actionsType.USER_INFO_PAGE_LOG_OUT:
      return {
        ...state,
        isMe: false,
      };
    default:
      return state;
  }
}
