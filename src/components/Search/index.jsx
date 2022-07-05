import React from "react";
import SearchBar from "./component/SearchBar";
import { Divider } from "antd";
import "./css/index.scss";
import SearchControl from "./component/SearchControl";
import SearchResult from "./component/SearchResult";
import { withUseSearchParamsHooksHOC } from "../../tools/withUseSearchParamsHooksHOC";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "../../reducers/searchPage";
const { change_search_target, change_sort_mode, send_to_search } = actions;
import { getQueryVariable } from "../../tools/getQueryVariable.js";
import { totalSearchTarget, totalSortMode } from "../../reducers/searchPage";

function getQueryParams() {
  let params = {};
  let searchTarget = getQueryVariable("searchTarget");
  params.searchTarget = searchTarget ? searchTarget : totalSearchTarget.POST;

  let sortMode = getQueryVariable("sortMode");
  params.sortMode = sortMode ? sortMode : totalSortMode.NEW;
  let skip = getQueryVariable("skip");
  params.skip = skip ? skip : 0;
  let keyword = getQueryVariable("keyword");
  params.keyword = keyword ? keyword : "";

  return params;
}

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.title = "搜索";
    const { keyword, skip, searchTarget, sortMode } = getQueryParams();
    this.props.change_search_target(searchTarget);
    this.props.change_sort_mode(sortMode);
    this.props.send_to_search(keyword, searchTarget, sortMode, skip);
  }

  render() {
    return (
      <div className="search-warp">
        <SearchBar
          send_to_search={this.props.send_to_search}
          getQueryParams={getQueryParams}
          setSearchParams={this.props.setSearchParams}
          getQueryVariable={getQueryVariable}
        ></SearchBar>
        <Divider></Divider>
        <SearchControl
          searchTarget={this.props.searchTarget}
          send_to_search={this.props.send_to_search}
          sortMode={this.props.sortMode}
          change_search_target={this.props.change_search_target}
          change_sort_mode={this.props.change_sort_mode}
          totalSearchTarget={totalSearchTarget}
          totalSortMode={totalSortMode}
          setSearchParams={this.props.setSearchParams}
          getQueryParams={getQueryParams}
        ></SearchControl>
        <Divider></Divider>
        <SearchResult
          showArray={this.props.showArray}
          sum={this.props.sum}
        ></SearchResult>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.searchPageState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    change_search_target: bindActionCreators(change_search_target, dispatch),
    change_sort_mode: bindActionCreators(change_sort_mode, dispatch),
    send_to_search: bindActionCreators(send_to_search, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUseSearchParamsHooksHOC(Search));
