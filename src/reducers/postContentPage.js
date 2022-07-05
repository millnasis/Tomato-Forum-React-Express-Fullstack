const initialState = {
  postContentBody: {},
  showReplyArray: [],
  replySum: 0,
  isFetchingPostNewReply: false,
  commentEditor: {
    replyID: null,
    targetID: null,
    targetUser: null,
    isMention: null,
  },
  responseToPostReply: false,
  responseToPostComment: false,
};

export const actionsType = {
  SEND_TO_GET_POST_CONTENT_BODY: "SEND_TO_GET_POST_CONTENT_BODY",
  SEND_TO_GET_SHOW_REPLY_ARRAY: "SEND_TO_GET_SHOW_REPLY_ARRAY",
  RESPONSE_POST_CONTENT_BODY: "RESPONSE_POST_CONTENT_BODY",
  RESPONSE_SHOW_REPLY_ARRAY: "RESPONSE_SHOW_REPLY_ARRAY",
  USER_SENT_TO_POST_NEW_REPLY: "USER_SENT_TO_POST_NEW_REPLY",
  RESPONSE_POST_NEW_REPLY: "RESPONSE_POST_NEW_REPLY",
  USER_SENT_TO_POST_NEW_COMMENT: "USER_SENT_TO_POST_NEW_COMMENT",
  RESPONSE_POST_NEW_COMMENT: "RESPONSE_POST_NEW_COMMENT",
  RESET_RESPONSE_POST_NEW_COMMENT: "RESET_RESPONSE_POST_NEW_COMMENT",
  USER_CHANGE_COMMENT_EDITOR: "USER_CHANGE_COMMENT_EDITOR",
  START_FETCH_POST_NEW_REPLY: "START_FETCH_POST_NEW_REPLY",
  END_FETCH_POST_NEW_REPLY: "END_FETCH_POST_NEW_REPLY",
  USER_SEND_TO_LIKE: "USER_SEND_TO_LIKE",
  RESPONSE_SEND_TO_LIKE: "RESPONSE_SEND_TO_LIKE",
  USER_SEND_TO_FAVORITE: "USER_SEND_TO_FAVORITE",
};

export const actions = {
  get_post_content_body(postid, click = false) {
    return {
      type: actionsType.SEND_TO_GET_POST_CONTENT_BODY,
      postid,
      click,
    };
  },
  get_show_reply_array(postid, skip, limit) {
    return {
      type: actionsType.SEND_TO_GET_SHOW_REPLY_ARRAY,
      postid,
      skip,
      limit,
    };
  },
  response_post_content_body(data) {
    return {
      type: actionsType.RESPONSE_POST_CONTENT_BODY,
      data,
    };
  },
  response_show_reply_array(data) {
    return {
      type: actionsType.RESPONSE_SHOW_REPLY_ARRAY,
      data,
    };
  },
  response_post_new_reply() {
    return {
      type: actionsType.RESPONSE_POST_NEW_REPLY,
    };
  },
  response_post_new_comment(replyID) {
    return {
      type: actionsType.RESPONSE_POST_NEW_COMMENT,
      replyID,
    };
  },
  reset_post_new_comment() {
    return {
      type: actionsType.RESET_RESPONSE_POST_NEW_COMMENT,
    };
  },
  post_new_reply(postid, publisher, content) {
    return {
      type: actionsType.USER_SENT_TO_POST_NEW_REPLY,
      postid,
      publisher,
      content,
    };
  },
  post_new_comment(
    replyID,
    publisher,
    content,
    isMention,
    mentionID = null,
    mentionUser = null
  ) {
    return {
      type: actionsType.USER_SENT_TO_POST_NEW_COMMENT,
      replyID,
      publisher,
      content,
      isMention,
      mentionID,
      mentionUser,
    };
  },
  change_comment_editor(replyID, targetID, targetUser, isMention) {
    return {
      type: actionsType.USER_CHANGE_COMMENT_EDITOR,
      replyID,
      targetID,
      targetUser,
      isMention,
    };
  },
  start_fetch_post_new_reply() {
    return {
      type: actionsType.START_FETCH_POST_NEW_REPLY,
    };
  },
  end_fetch_post_new_reply() {
    return {
      type: actionsType.END_FETCH_POST_NEW_REPLY,
    };
  },
  send_to_like(target, id, publisher) {
    return {
      type: actionsType.USER_SEND_TO_LIKE,
      target,
      id,
      publisher,
    };
  },
  response_send_to_like(target, data) {
    return {
      type: actionsType.RESPONSE_SEND_TO_LIKE,
      target,
      data,
    };
  },
  send_to_favorite(userid, postid) {
    return {
      type: actionsType.USER_SEND_TO_FAVORITE,
      userid,
      postid,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_POST_CONTENT_BODY:
      return {
        ...state,
        postContentBody: action.data,
      };
    case actionsType.RESPONSE_SHOW_REPLY_ARRAY:
      return {
        ...state,
        showReplyArray: action.data.showReplyArray,
        replySum: action.data.replySum,
      };
    case actionsType.START_FETCH_POST_NEW_REPLY:
      return {
        ...state,
        isFetchingPostNewReply: true,
      };
    case actionsType.END_FETCH_POST_NEW_REPLY:
      return {
        ...state,
        isFetchingPostNewReply: false,
      };
    case actionsType.RESPONSE_POST_NEW_REPLY:
      return {
        ...state,
        responseToPostReply: true,
      };
    case actionsType.RESPONSE_POST_NEW_COMMENT:
      return {
        ...state,
        responseToPostComment: action.replyID,
      };
    case actionsType.RESET_RESPONSE_POST_NEW_COMMENT:
      return {
        ...state,
        responseToPostComment: false,
        commentEditor: {
          replyID: null,
          targetID: null,
          targetUser: null,
        },
      };
    case actionsType.USER_CHANGE_COMMENT_EDITOR:
      return {
        ...state,
        commentEditor: {
          replyID:
            action.targetID === state.commentEditor.targetID
              ? null
              : action.replyID,
          targetID:
            action.targetID === state.commentEditor.targetID
              ? null
              : action.targetID,
          targetUser:
            action.targetID === state.commentEditor.targetID
              ? null
              : action.targetUser,
          isMention:
            action.targetID === state.commentEditor.targetID
              ? null
              : action.isMention,
        },
      };
    case actionsType.RESPONSE_SEND_TO_LIKE:
      if (action.target === "post") {
        return {
          ...state,
          postContentBody: action.data,
        };
      } else if (action.target === "reply") {
        return {
          ...state,
          showReplyArray: state.showReplyArray.map((value) =>
            value.id === action.data.id
              ? { ...value, likeList: action.data.likeList }
              : value
          ),
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}
