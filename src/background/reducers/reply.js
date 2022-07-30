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
  modal: {
    show: false,
    target: {},
  },
  comments: {
    show: false,
    target: [],
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
  OPEN_REPLY_UPDATE_MODAL: "OPEN_REPLY_UPDATE_MODAL",
  CLOSE_REPLY_UPDATE_MODAL: "CLOSE_REPLY_UPDATE_MODAL",
  OPEN_REPLY_COMMENTS_UPDATE_MODAL: "OPEN_REPLY_COMMENTS_UPDATE_MODAL",
  CLOSE_REPLY_COMMENTS_UPDATE_MODAL: "CLOSE_REPLY_COMMENTS_UPDATE_MODAL",
};

export const actions = {
  open_update_modal(id) {
    return {
      type: actionsType.OPEN_REPLY_UPDATE_MODAL,
      id,
    };
  },
  close_update_modal() {
    return {
      type: actionsType.CLOSE_REPLY_UPDATE_MODAL,
    };
  },
  open_comments_update_modal(target) {
    return {
      type: actionsType.OPEN_REPLY_COMMENTS_UPDATE_MODAL,
      target,
    };
  },
  close_comments_update_modal() {
    return {
      type: actionsType.CLOSE_REPLY_COMMENTS_UPDATE_MODAL,
    };
  },
  get_background_reply_show_array(pagination, query) {
    if (!pagination) {
      pagination = initialState.pagination;
    }
    if (!query) {
      query = initialState.query;
    }
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
    if (!query) {
      query = initialState.query;
    }
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
        showArray: action.data.arr,
        pagination: action.data.pagination,
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
    case actionsType.OPEN_REPLY_UPDATE_MODAL:
      return {
        ...state,
        modal: {
          show: true,
          target: state.showArray.find((v) => v.id === action.id),
        },
      };
    case actionsType.CLOSE_REPLY_UPDATE_MODAL:
      return {
        ...state,
        modal: {
          show: false,
          target: {},
        },
      };
    case actionsType.OPEN_REPLY_COMMENTS_UPDATE_MODAL:
      return {
        ...state,
        comments: {
          show: true,
          target: action.target,
        },
      };
    case actionsType.CLOSE_REPLY_COMMENTS_UPDATE_MODAL:
      return {
        ...state,
        comments: {
          show: false,
          target: {},
        },
      };
    default:
      return state;
  }
}
