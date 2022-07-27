const initialState = {
  showArray: [],
  pagination: {
    current: 1,
    total: 0,
    pageSize: 10,
  },
  query: {
    id: "",
    masterID: "",
    publisher: "",
  },
};

export const actionsType = {
  SEND_TO_GET_BACKGROUND_REPLY_SHOW_ARRAY:
    "SEND_TO_GET_BACKGROUND_REPLY_SHOW_ARRAY",
  RESPONSE_BACKGROUND_REPLY_SHOW_ARRAY: "RESPONSE_BACKGROUND_REPLY_SHOW_ARRAY",
  SET_BACKGROUND_REPLY_PAGINATION: "SET_BACKGROUND_REPLY_PAGINATION",
  SET_BACKGROUND_REPLY_QUERY: "SET_BACKGROUND_REPLY_QUERY",
  SEND_TO_UPDATE_SINGLE_REPLY: "SEND_TO_UPDATE_SINGLE_REPLY",
  SEND_TO_DELETE_SINGLE_REPLY: "SEND_TO_DELETE_SINGLE_REPLY",
};

export const actions = {
  get_background_reply_show_array(pagination, query) {
    return {
      type: actionsType.SEND_TO_GET_BACKGROUND_REPLY_SHOW_ARRAY,
      pagination,
      query,
    };
  },
  response_background_reply_show_array(data) {
    return {
      type: actionsType.RESPONSE_BACKGROUND_REPLY_SHOW_ARRAY,
      data,
    };
  },
  set_background_reply_pagination(current, pageSize) {
    return {
      type: actionsType.SET_BACKGROUND_REPLY_PAGINATION,
      current,
      pageSize,
    };
  },
  set_background_reply_query(query) {
    return {
      type: actionsType.SET_BACKGROUND_REPLY_QUERY,
      query,
    };
  },
  update_single_reply(id, obj) {
    return {
      type: actionsType.SEND_TO_UPDATE_SINGLE_REPLY,
      id,
      obj,
    };
  },
  delete_single_reply(id) {
    return {
      type: actionsType.SEND_TO_DELETE_SINGLE_REPLY,
      id,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_BACKGROUND_REPLY_SHOW_ARRAY:
      return {
        ...state,
        showArray: action.data,
      };
    case actionsType.SET_BACKGROUND_REPLY_PAGINATION:
      return {
        ...state,
        pagination: {
          current: action.current,
          pageSize: action.pageSize,
        },
      };
    case actionsType.SET_BACKGROUND_REPLY_QUERY:
      return {
        ...state,
        query: action.query,
      };
    default:
      return state;
  }
}
