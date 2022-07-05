const TotalMSGtype = {
  LIKE: "like",
  REPLY: "reply",
  COMMENT: "comment",
  FAVORITE: "favorite",
  MEMTION: "mention",
};

export const TotalTargetType = {
  POST: "post",
  REPLY: "reply",
  COMMENT: "comment",
};

export const TotalTab = TotalMSGtype;

const initialState = {
  nowTab: TotalTab.LIKE,
  showMessageArray: [],
  messageSum: 0,
};

export const actionsType = {
  USER_SWITCH_TAB: "USER_SWITCH_TAB",
  SEND_TO_GET_SHOW_MESSAGE_ARRAY: "SEND_TO_GET_SHOW_MESSAGE_ARRAY",
  RESPONSE_SHOW_MESSAGE_ARRAY: "RESPONSE_SHOW_MESSAGE_ARRAY",
};

export const actions = {
  switch_tab(tab) {
    return {
      type: actionsType.USER_SWITCH_TAB,
      tab,
    };
  },
  get_show_message_array(userid, messageType, skip) {
    return {
      type: actionsType.SEND_TO_GET_SHOW_MESSAGE_ARRAY,
      userid,
      messageType,
      skip,
    };
  },
  response_show_message_array(data) {
    return {
      type: actionsType.RESPONSE_SHOW_MESSAGE_ARRAY,
      array:data.array,
      sum:data.sum
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.USER_SWITCH_TAB:
      return {
        ...state,
        nowTab: action.tab,
        showMessageArray: [],
        pageSum: 0,
      };
    case actionsType.RESPONSE_SHOW_MESSAGE_ARRAY:
      return {
        ...state,
        showMessageArray: action.array,
        messageSum: action.sum,
      };
    default:
      return state;
  }
}
