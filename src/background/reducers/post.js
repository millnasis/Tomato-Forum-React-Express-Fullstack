const initialState = {
  showArray: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  query: {
    id: "",
    title: "",
    publisher: "",
  },
  modal: {
    show: false,
    target: {},
  },
};

export const actionsType = {
  SEND_TO_GET_BACKGROUND_POST_SHOW_ARRAY:
    "SEND_TO_GET_BACKGROUND_POST_SHOW_ARRAY",
  RESPONSE_BACKGROUND_POST_SHOW_ARRAY: "RESPONSE_BACKGROUND_POST_SHOW_ARRAY",
  SET_BACKGROUND_POST_PAGINATION: "SET_BACKGROUND_POST_PAGINATION",
  SET_BACKGROUND_POST_QUERY: "SET_BACKGROUND_POST_QUERY",
  SEND_TO_UPDATE_SINGLE_POST: "SEND_TO_UPDATE_SINGLE_POST",
  SEND_TO_DELETE_SINGLE_POST: "SEND_TO_DELETE_SINGLE_POST",
  OPEN_POST_UPDATE_MODAL: "OPEN_POST_UPDATE_MODAL",
  CLOSE_POST_UPDATE_MODAL: "CLOSE_POST_UPDATE_MODAL",
};

export const actions = {
  open_update_modal(id) {
    return {
      type: actionsType.OPEN_POST_UPDATE_MODAL,
      id,
    };
  },
  close_update_modal() {
    return {
      type: actionsType.CLOSE_POST_UPDATE_MODAL,
    };
  },
  get_background_post_show_array(pagination, query) {
    if (!pagination) {
      pagination = initialState.pagination;
    }
    if (!query) {
      query = initialState.query;
    }
    return {
      type: actionsType.SEND_TO_GET_BACKGROUND_POST_SHOW_ARRAY,
      pagination,
      query,
    };
  },
  response_background_post_show_array(data) {
    return {
      type: actionsType.RESPONSE_BACKGROUND_POST_SHOW_ARRAY,
      data,
    };
  },
  set_background_post_pagination(current, pageSize) {
    return {
      type: actionsType.SET_BACKGROUND_POST_PAGINATION,
      current,
      pageSize,
    };
  },
  set_background_post_query(query) {
    if (!query) {
      query = initialState.query;
    }
    return {
      type: actionsType.SET_BACKGROUND_POST_QUERY,
      query,
    };
  },
  update_single_post(id, obj) {
    return {
      type: actionsType.SEND_TO_UPDATE_SINGLE_POST,
      id,
      obj,
    };
  },
  delete_single_post(id) {
    return {
      type: actionsType.SEND_TO_DELETE_SINGLE_POST,
      id,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_BACKGROUND_POST_SHOW_ARRAY:
      return {
        ...state,
        showArray: action.data.arr,
        pagination: action.data.pagination,
      };
    case actionsType.SET_BACKGROUND_POST_PAGINATION:
      return {
        ...state,
        pagination: {
          current: action.current,
          pageSize: action.pageSize,
        },
      };
    case actionsType.SET_BACKGROUND_POST_QUERY:
      return {
        ...state,
        query: action.query,
      };
    case actionsType.OPEN_POST_UPDATE_MODAL:
      return {
        ...state,
        modal: {
          show: true,
          target: state.showArray.find((v) => v.id === action.id),
        },
      };
    case actionsType.CLOSE_POST_UPDATE_MODAL:
      return {
        ...state,
        modal: {
          show: false,
          target: {},
        },
      };
    default:
      return state;
  }
}
