export const totalUserPermitValue = {
  ALL: "ALL",
  USER: "USER",
  ADMIN: "ADMIN",
};

const initialState = {
  showArray: [],
  pagination: {
    current: 1,
    pageSize: 10,
  },
  query: {
    id: "",
    username: "",
    permit: totalUserPermitValue.ALL,
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
};

export const actions = {
  get_background_user_show_array(pagination, query) {
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
    };
  },
  delete_single_user(id) {
    return {
      type: actionsType.SEND_TO_DELETE_SINGLE_USER,
      id,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_BACKGROUND_USER_SHOW_ARRAY:
      return {
        ...state,
        showArray: action.data,
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
    default:
      return state;
  }
}
