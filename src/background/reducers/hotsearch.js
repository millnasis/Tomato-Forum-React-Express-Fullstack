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
  showArray: [],
  pagination: {
    current: 1,
    total: 0,
    pageSize: 10,
  },
  query: {
    word: "",
    type: totalHotSearchTypeState.ALL,
    sort: totalSortSelectionState.DESC,
  },
};

export const actionsType = {
    SEND_TO_GET_BACKGROUND_HOT_SEARCH_SHOW_ARRAY:
      "SEND_TO_GET_BACKGROUND_HOT_SEARCH_SHOW_ARRAY",
    RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_ARRAY: "RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_ARRAY",
    SET_BACKGROUND_HOT_SEARCH_PAGINATION: "SET_BACKGROUND_HOT_SEARCH_PAGINATION",
    SET_BACKGROUND_HOT_SEARCH_QUERY: "SET_BACKGROUND_HOT_SEARCH_QUERY",
    SEND_TO_UPDATE_SINGLE_HOT_SEARCH: "SEND_TO_UPDATE_SINGLE_HOT_SEARCH",
  SEND_TO_DELETE_SINGLE_HOT_SEARCH: "SEND_TO_DELETE_SINGLE_HOT_SEARCH",
  };
  
  export const actions = {
    get_background_hot_search_show_array(pagination, query) {
      return {
        type: actionsType.SEND_TO_GET_BACKGROUND_HOT_SEARCH_SHOW_ARRAY,
        pagination,
        query,
      };
    },
    response_background_hot_search_show_array(data) {
      return {
        type: actionsType.RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_ARRAY,
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
      return {
        type: actionsType.SET_BACKGROUND_HOT_SEARCH_QUERY,
        query,
      };
    },
    update_single_hot_search(id, obj) {
        return {
          type: actionsType.SEND_TO_UPDATE_SINGLE_HOT_SEARCH,
          id,
          obj,
        };
      },
      delete_single_hot_search(id) {
        return {
          type: actionsType.SEND_TO_DELETE_SINGLE_HOT_SEARCH,
          id,
        };
      },
  };
  
  export function reducer(state = initialState, action) {
    switch (action.type) {
      case actionsType.RESPONSE_BACKGROUND_HOT_SEARCH_SHOW_ARRAY:
        return {
          ...state,
          showArray: action.data,
        };
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
      default:
        return state;
    }
  }
  