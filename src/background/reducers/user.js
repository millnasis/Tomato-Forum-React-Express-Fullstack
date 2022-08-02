export const totalUserPermitValue = {
  ALL: "ALL",
  USER: "USER",
  ADMIN: "ADMIN",
};

export const sexState = {
  male: "男",
  female: "女",
  none: null,
};

const initialState = {
  showArray: [],
  pagination: {
    current: 1,
    total: 0,
    pageSize: 10,
  },
  query: {
    id: "",
    username: "",
    permit: totalUserPermitValue.ALL,
  },
  modal: {
    show: false,
    target: {},
  },
};

export const actionsType = {
  SEND_TO_GET_BACKGROUND_USER_SHOW_ARRAY:
    "SEND_TO_GET_BACKGROUND_USER_SHOW_ARRAY",
  RESPONSE_BACKGROUND_USER_SHOW_ARRAY: "RESPONSE_BACKGROUND_USER_SHOW_ARRAY",
  SET_BACKGROUND_USER_PAGINATION: "SET_BACKGROUND_USER_PAGINATION",
  SET_BACKGROUND_USER_QUERY: "SET_BACKGROUND_USER_QUERY",
  SEND_TO_UPDATE_SINGLE_USER: "SEND_TO_UPDATE_SINGLE_USER",
  SEND_TO_DELETE_SINGLE_USER: "SEND_TO_DELETE_SINGLE_USER",
  OPEN_USER_UPDATE_MODAL: "OPEN_USER_UPDATE_MODAL",
  CLOSE_USER_UPDATE_MODAL: "CLOSE_USER_UPDATE_MODAL",
};

export const actions = {
  open_update_modal(id) {
    return {
      type: actionsType.OPEN_USER_UPDATE_MODAL,
      id,
    };
  },
  close_update_modal() {
    return {
      type: actionsType.CLOSE_USER_UPDATE_MODAL,
    };
  },
  get_background_user_show_array(pagination, query) {
    if (!pagination) {
      pagination = initialState.pagination;
    }
    if (!query) {
      query = initialState.query;
    }
    return {
      type: actionsType.SEND_TO_GET_BACKGROUND_USER_SHOW_ARRAY,
      pagination,
      query,
    };
  },
  response_background_user_show_array(data) {
    return {
      type: actionsType.RESPONSE_BACKGROUND_USER_SHOW_ARRAY,
      data,
    };
  },
  set_background_user_pagination(current, pageSize) {
    return {
      type: actionsType.SET_BACKGROUND_USER_PAGINATION,
      current,
      pageSize,
    };
  },
  set_background_user_query(query) {
    if (!query) {
      query = initialState.query;
    }
    return {
      type: actionsType.SET_BACKGROUND_USER_QUERY,
      query,
    };
  },
  update_single_user(id, obj) {
    return {
      type: actionsType.SEND_TO_UPDATE_SINGLE_USER,
      id,
      obj,
      query,
      pagination,
    };
  },
  delete_single_user(id) {
    return {
      type: actionsType.SEND_TO_DELETE_SINGLE_USER,
      id,
      query,
      pagination,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_BACKGROUND_USER_SHOW_ARRAY:
      return {
        ...state,
        showArray: action.data.arr,
        pagination: action.data.pagination,
      };
    case actionsType.SET_BACKGROUND_USER_PAGINATION:
      return {
        ...state,
        pagination: {
          current: action.current,
          pageSize: action.pageSize,
        },
      };
    case actionsType.SET_BACKGROUND_USER_QUERY:
      return {
        ...state,
        query: action.query,
      };
    case actionsType.OPEN_USER_UPDATE_MODAL:
      return {
        ...state,
        modal: {
          show: true,
          target: state.showArray.find((v) => v.id === action.id),
        },
      };
    case actionsType.CLOSE_USER_UPDATE_MODAL:
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
