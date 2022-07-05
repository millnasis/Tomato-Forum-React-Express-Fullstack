const initialState = {
  searchTarget: "",
  sortMode: "",
  showArray: [],
  sum: 0,
};

export const totalSearchTarget = {
  POST: "POST",
  USER: "USER",
};

export const totalSortMode = {
  NEW: "NEW",
  CLICK: "CLICK",
  LIKE: "LIKE",
  REPLY: "REPLY",
  FAVORITE: "FAVORITE",
  POST: "POST",
};

export const actionsType = {
  SEND_TO_SEARCH_GET_SHOW_ARRAY: "SEND_TO_SEARCH_GET_SHOW_ARRAY",
  RESPONSE_SHOW_ARRAY: "RESPONSE_SHOW_ARRAY",
  CHANGE_SEARCH_TARGET: "CHANGE_SEARCH_TARGET",
  CHANGE_SORT_MODE: "CHANGE_SORT_MODE",
};

export const actions = {
  send_to_search(keyword, searchTarget, sortMode, skip) {
    searchTarget = searchTarget ? searchTarget : totalSearchTarget.POST;
    skip = skip ? skip : 0;
    sortMode = sortMode ? sortMode : totalSortMode.NEW;
    return {
      type: actionsType.SEND_TO_SEARCH_GET_SHOW_ARRAY,
      keyword,
      searchTarget,
      sortMode,
      skip,
    };
  },
  response_show_array(data) {
    return {
      type: actionsType.RESPONSE_SHOW_ARRAY,
      arr: data.arr,
      sum: data.sum,
    };
  },
  change_search_target(target) {
    return {
      type: actionsType.CHANGE_SEARCH_TARGET,
      target,
    };
  },
  change_sort_mode(mode) {
    return {
      type: actionsType.CHANGE_SORT_MODE,
      mode,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.CHANGE_SEARCH_TARGET:
      return {
        ...state,
        searchTarget: action.target,
        sortMode: totalSortMode.NEW,
      };
    case actionsType.CHANGE_SORT_MODE:
      return {
        ...state,
        sortMode: action.mode,
      };
    case actionsType.RESPONSE_SHOW_ARRAY:
      return {
        ...state,
        showArray: action.arr,
      };
    default:
      return state;
  }
}
