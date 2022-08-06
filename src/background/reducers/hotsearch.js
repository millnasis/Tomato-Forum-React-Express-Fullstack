export const totalSortSelectionState = {
  DESC: "DESC",
  ASC: "ASC",
};

export const totalHotSearchTypeState = {
  ALL: "ALL",
  CONTROL: "CONTROL",
  NORMAL: "NORMAL",
};

const initialState = {
  showNormalArray: [],
  showControlArray: [],
  pagination: {
    current: 1,
    total: 0,
    pageSize: 10,
  },
  query: {
    word: "",
    sort: totalSortSelectionState.DESC,
  },
  modal: {
    show: false,
    target: {},
  },
  controlWordSortState: false,
};

export const actionsType = {
  SEND_TO_GET_BACKGROUND_HOT_SEARCH_SHOW_NORMAL_ARRAY:
    "SEND_TO_GET_BACKGROUND_HOT_SEARCH_SHOW_NORMAL_ARRAY",
  SEND_TO_GET_BACKGROUND_HOT_SEARCH_SHOW_CONTROL_ARRAY:
    "SEND_TO_GET_BACKGROUND_HOT_SEARCH_SHOW_CONTROL_ARRAY",
  RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_NORMAL_ARRAY:
    "RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_NORMAL_ARRAY",
  RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_CONTROL_ARRAY:
    "RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_CONTROL_ARRAY",
  SET_BACKGROUND_HOT_SEARCH_PAGINATION: "SET_BACKGROUND_HOT_SEARCH_PAGINATION",
  SET_BACKGROUND_HOT_SEARCH_QUERY: "SET_BACKGROUND_HOT_SEARCH_QUERY",
  SEND_TO_UPDATE_SINGLE_NORMAL_HOT_SEARCH:
    "SEND_TO_UPDATE_SINGLE_NORMAL_HOT_SEARCH",
  SEND_TO_ADD_SINGLE_NORMAL_HOT_SEARCH: "SEND_TO_ADD_SINGLE_NORMAL_HOT_SEARCH",
  SEND_TO_DELETE_SINGLE_NORMAL_HOT_SEARCH:
    "SEND_TO_DELETE_SINGLE_NORMAL_HOT_SEARCH",
  SEND_TO_DELETE_SINGLE_CONTROL_HOT_SEARCH:
    "SEND_TO_DELETE_SINGLE_CONTROL_HOT_SEARCH",
  OPEN_HOT_SEARCH_UPDATE_MODAL: "OPEN_HOT_SEARCH_UPDATE_MODAL",
  CLOSE_HOT_SEARCH_UPDATE_MODAL: "CLOSE_HOT_SEARCH_UPDATE_MODAL",
  CHANGE_SHOW_CONTROL_ARRAY_RANK: "CHANGE_SHOW_CONTROL_ARRAY_RANK",
  SEND_TO_UPDATE_HOT_SEARCH_CONTROL_ARRAY:
    "SEND_TO_UPDATE_HOT_SEARCH_CONTROL_ARRAY",
  RESPONSE_UPDATE_HOT_SEARCH_CONTROL_ARRAY:
    "RESPONSE_UPDATE_HOT_SEARCH_CONTROL_ARRAY",
};

export const actions = {
  change_control_array_rank(arr) {
    return {
      type: actionsType.CHANGE_SHOW_CONTROL_ARRAY_RANK,
      arr,
    };
  },
  update_hot_search_control_array(arr) {
    return {
      type: actionsType.SEND_TO_UPDATE_HOT_SEARCH_CONTROL_ARRAY,
      arr,
    };
  },
  response_control_array_change(arr) {
    return {
      type: actionsType.RESPONSE_UPDATE_HOT_SEARCH_CONTROL_ARRAY,
    };
  },
  open_update_modal(id) {
    return {
      type: actionsType.OPEN_HOT_SEARCH_UPDATE_MODAL,
      id,
    };
  },
  close_update_modal() {
    return {
      type: actionsType.CLOSE_HOT_SEARCH_UPDATE_MODAL,
    };
  },
  get_background_hot_search_show_normal_array(pagination, query) {
    if (!pagination) {
      pagination = initialState.pagination;
    }
    if (!query) {
      query = initialState.query;
    }
    return {
      type: actionsType.SEND_TO_GET_BACKGROUND_HOT_SEARCH_SHOW_NORMAL_ARRAY,
      pagination,
      query,
    };
  },
  get_background_hot_search_show_control_array() {
    return {
      type: actionsType.SEND_TO_GET_BACKGROUND_HOT_SEARCH_SHOW_CONTROL_ARRAY,
    };
  },
  response_background_hot_search_show_normal_array(data) {
    return {
      type: actionsType.RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_NORMAL_ARRAY,
      data,
    };
  },
  response_background_hot_search_show_control_array(data) {
    return {
      type: actionsType.RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_CONTROL_ARRAY,
      data,
    };
  },
  set_background_hot_search_pagination(current, pageSize) {
    return {
      type: actionsType.SET_BACKGROUND_HOT_SEARCH_PAGINATION,
      current,
      pageSize,
    };
  },
  set_background_hot_search_query(query) {
    if (!query) {
      query = initialState.query;
    }
    return {
      type: actionsType.SET_BACKGROUND_HOT_SEARCH_QUERY,
      query,
    };
  },
  update_single_normal_hot_search(id, obj, query, pagination) {
    return {
      type: actionsType.SEND_TO_UPDATE_SINGLE_NORMAL_HOT_SEARCH,
      id,
      obj,
      query,
      pagination,
    };
  },
  delete_single_normal_hot_search(id, query, pagination) {
    return {
      type: actionsType.SEND_TO_DELETE_SINGLE_NORMAL_HOT_SEARCH,
      id,
      query,
      pagination,
    };
  },
  add_single_normal_hot_search(obj, query, pagination) {
    return {
      type: actionsType.SEND_TO_ADD_SINGLE_NORMAL_HOT_SEARCH,
      obj,
      query,
      pagination,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_NORMAL_ARRAY:
      return {
        ...state,
        showNormalArray: action.data.arr,
        pagination: action.data.pagination,
      };
    case actionsType.RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_CONTROL_ARRAY: {
      return {
        ...state,
        showControlArray: action.data.map((v, i) => {
          return {
            word: v,
            index: i,
          };
        }),
      };
    }
    case actionsType.SET_BACKGROUND_HOT_SEARCH_PAGINATION:
      return {
        ...state,
        pagination: {
          current: action.current,
          pageSize: action.pageSize,
        },
      };
    case actionsType.SET_BACKGROUND_HOT_SEARCH_QUERY:
      return {
        ...state,
        query: action.query,
      };
    case actionsType.CHANGE_SHOW_CONTROL_ARRAY_RANK:
      return {
        ...state,
        showControlArray: action.arr,
        controlWordSortState: true,
      };
    case actionsType.OPEN_HOT_SEARCH_UPDATE_MODAL:
      return {
        ...state,
        modal: {
          show: true,
          target: state.showNormalArray.find((v) => v._id === action.id),
        },
      };
    case actionsType.CLOSE_HOT_SEARCH_UPDATE_MODAL:
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
