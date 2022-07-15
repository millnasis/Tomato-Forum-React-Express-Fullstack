import React from "react";
import SearchBar from "./component/SearchBar";
import { Divider, Switch } from "antd";
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
import { CSSTransition } from "react-transition-group";

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

    this.state = {
      start: false,
      show: false,
      unknownKeyword: false,
    };
  }

  componentDidMount() {
    document.title = "搜索";
    const { keyword, skip, searchTarget, sortMode } = getQueryParams();
    this.props.change_search_target(searchTarget);
    this.props.change_sort_mode(sortMode);
    if (!keyword) {
      this.setState({ unknownKeyword: true });
      return;
    }
    this.props.send_to_search(keyword, searchTarget, sortMode, skip);
  }

  showSearchContent = () => {
    if (this.state.unknownKeyword) {
      this.setState({ start: true });
    }
  };

  render() {
    return (
      <div className="search-warp">
        <CSSTransition
          in={this.state.start}
          timeout={700}
          classNames="search-bar"
          onEntering={() => {
            setTimeout(() => {
              this.setState({ show: true });
            }, 300);
          }}
        >
          <SearchBar
            key="search-bar"
            className={!this.state.unknownKeyword ? "" : "search-bar-enter"}
            send_to_search={this.props.send_to_search}
            getQueryParams={getQueryParams}
            showSearchContent={this.showSearchContent}
            setSearchParams={this.props.setSearchParams}
            getQueryVariable={getQueryVariable}
          ></SearchBar>
        </CSSTransition>
        <CSSTransition
          in={this.state.show}
          timeout={700}
          classNames="search-content"
        >
          <div
            className={!this.state.unknownKeyword ? "" : "search-content-enter"}
          >
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
              searchTarget={this.props.searchTarget}
              send_to_search={this.props.send_to_search}
              totalSearchTarget={totalSearchTarget}
              showArray={this.props.showArray}
              setSearchParams={this.props.setSearchParams}
              getQueryParams={getQueryParams}
              sum={this.props.sum}
            ></SearchResult>
          </div>
        </CSSTransition>
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
