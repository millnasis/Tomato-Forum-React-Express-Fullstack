const initialState = {
  isShowEditBoard: false,
  isFetchingPublishPost: false,
  isFetchingHotPost: false,
  isFetchingNewPost: false,
  showHotPostArray: [],
  showNewPostArray: [],
  showHotSearchArray: [],
  showClickPostArray: [],
};

export const actionsType = {
  SEND_TO_GET_HOT_POST_ARRAY: "SEND_TO_GET_HOT_POST_ARRAY",
  SEND_TO_GET_NEW_POST_ARRAY: "SEND_TO_GET_NEW_POST_ARRAY",
  SEND_TO_GET_CLICK_POST_ARRAY: "SEND_TO_GET_CLICK_POST_ARRAY",
  SEND_TO_GET_HOT_SEARCH: "SENT_TO_GET_HOT_SEARCH",
  RESPONSE_HOT_SEARCH: "RESPONSE_HOT_SEARCH",
  RESPONSE_HOT_POST_ARRAY: "RESPONSE_HOT_POST_ARRAY",
  RESPONSE_NEW_POST_ARRAY: "RESPONSE_NEW_POST_ARRAY",
  RESPONSE_NEW_CLICK_ARRAY: "RESPONSE_NEW_CLICK_ARRAY",
  START_FETCH_HOT_POST: "START_FETCH_HOT_POST",
  END_FETCH_HOT_POST: "END_FETCH_HOT_POST",
  START_FETCH_NEW_POST: "START_FETCH_NEW_POST",
  END_FETCH_NEW_POST: "END_FETCH_NEW_POST",
  START_FETCH_PUBLISH_NEW_POST: "START_FETCH_PUBLISH_NEW_POST",
  END_FETCH_PUBLISH_NEW_POST: "END_FETCH_PUBLISH_NEW_POST",
  USER_SHOW_EDIT_BOARD: "USER_SHOW_EDIT_BOARD",
  USER_CLOSE_EDIT_BOARD: "USER_CLOSE_EDIT_BOARD",
  USER_PUBLISH_NEW_POST: "USER_PUBLISH_NEW_POST",
  CLEAR_MAIN_INDEX_ARRAY: "CLEAR_MAIN_INDEX_ARRAY",
};

export const actions = {
  get_hot_post_array(skip, limit) {
    return {
      type: actionsType.SEND_TO_GET_HOT_POST_ARRAY,
      skip: skip,
      limit: limit,
    };
  },
  get_new_post_array(skip, limit) {
    return {
      type: actionsType.SEND_TO_GET_NEW_POST_ARRAY,
      skip: skip,
      limit: limit,
    };
  },
  get_click_post_array(limit) {
    return {
      type: actionsType.SEND_TO_GET_CLICK_POST_ARRAY,
      limit,
    };
  },
  get_hot_search() {
    return {
      type: actionsType.SEND_TO_GET_HOT_SEARCH,
    };
  },
  response_hot_search(data) {
    return {
      type: actionsType.RESPONSE_HOT_SEARCH,
      data,
    };
  },
  response_hot_post_array(data) {
    return {
      type: actionsType.RESPONSE_HOT_POST_ARRAY,
      showHotPostArray: data,
    };
  },
  response_new_post_array(data) {
    return {
      type: actionsType.RESPONSE_NEW_POST_ARRAY,
      showNewPostArray: data,
    };
  },
  response_click_post_array(data) {
    return {
      type: actionsType.RESPONSE_NEW_CLICK_ARRAY,
      arr: data,
    };
  },
  start_hot_array_fetch() {
    return {
      type: actionsType.START_FETCH_HOT_POST,
    };
  },
  start_new_array_fetch() {
    return {
      type: actionsType.START_FETCH_NEW_POST,
    };
  },
  end_hot_array_fetch() {
    return {
      type: actionsType.END_FETCH_HOT_POST,
    };
  },
  end_new_array_fetch() {
    return {
      type: actionsType.END_FETCH_NEW_POST,
    };
  },
  show_edit_board() {
    return {
      type: actionsType.USER_SHOW_EDIT_BOARD,
    };
  },
  close_edit_board() {
    return {
      type: actionsType.USER_CLOSE_EDIT_BOARD,
    };
  },
  publish_new_post(title, html, username) {
    return {
      type: actionsType.USER_PUBLISH_NEW_POST,
      title,
      content: html,
      publisher: username,
    };
  },
  start_publish_post_fetch() {
    return {
      type: actionsType.START_FETCH_PUBLISH_NEW_POST,
    };
  },
  end_publish_post_fetch() {
    return {
      type: actionsType.END_FETCH_PUBLISH_NEW_POST,
    };
  },
  clear_array() {
    return {
      type: actionsType.CLEAR_MAIN_INDEX_ARRAY,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.SEND_TO_GET_HOT_POST_ARRAY:
      return {
        ...state,
        showHotPostArray: [
          ...state.showHotPostArray,
          ...[...Array(action.limit).keys()].map((value) => {
            return {
              loading: true,
            };
          }),
        ],
      };
    case actionsType.SEND_TO_GET_NEW_POST_ARRAY:
      return {
        ...state,
        showNewPostArray: [
          ...state.showNewPostArray,
          ...[...Array(action.limit).keys()].map((value) => {
            return {
              loading: true,
            };
          }),
        ],
      };
    case actionsType.RESPONSE_HOT_POST_ARRAY:
      return {
        ...state,
        showHotPostArray: [
          ...state.showHotPostArray.filter((value) => !value.loading),
          ...action.showHotPostArray,
        ],
      };
    case actionsType.RESPONSE_NEW_POST_ARRAY:
      return {
        ...state,
        showNewPostArray: [
          ...state.showNewPostArray.filter((value) => !value.loading),
          ...action.showNewPostArray,
        ],
      };
    case actionsType.RESPONSE_NEW_CLICK_ARRAY:
      return {
        ...state,
        showClickPostArray: action.arr,
      };
    case actionsType.RESPONSE_HOT_SEARCH: {
      const { normal, control } = action.data;
      const arr = control.map((v) => {
        return {
          word: v,
          click: 0,
          type: "control",
        };
      });
      arr.push(...normal);
      return {
        ...state,
        showHotSearchArray: arr,
      };
    }
    case actionsType.END_FETCH_HOT_POST:
      return {
        ...state,
        isFetchingHotPost: false,
      };
    case actionsType.END_FETCH_NEW_POST:
      return {
        ...state,
        isFetchingNewPost: false,
      };
    case actionsType.START_FETCH_HOT_POST:
      return {
        ...state,
        isFetchingHotPost: true,
      };
    case actionsType.START_FETCH_NEW_POST:
      return {
        ...state,
        isFetchingNewPost: true,
      };
    case actionsType.USER_SHOW_EDIT_BOARD:
      return {
        ...state,
        isShowEditBoard: true,
      };
    case actionsType.USER_CLOSE_EDIT_BOARD:
      return {
        ...state,
        isShowEditBoard: false,
      };
    case actionsType.START_FETCH_PUBLISH_NEW_POST:
      return {
        ...state,
        isFetchingPublishPost: true,
      };
    case actionsType.END_FETCH_PUBLISH_NEW_POST:
      return {
        ...state,
        isFetchingPublishPost: false,
      };
    case actionsType.CLEAR_MAIN_INDEX_ARRAY:
      return {
        ...state,
        showHotPostArray: [],
        showHotSearchArray: [],
        showNewPostArray: [],
      };
    default:
      return state;
  }
}
