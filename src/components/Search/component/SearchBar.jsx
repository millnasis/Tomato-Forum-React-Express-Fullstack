import React from "react";
import { Input } from "antd";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
  }

  search(value) {
    let params = this.props.getQueryParams();
    let { searchTarget, sortMode, skip, keyword } = params;
    keyword = decodeURI(keyword);
    this.props.setSearchParams({ ...params, keyword: value });
    this.props.send_to_search(value, searchTarget, sortMode, skip);
    this.props.showSearchContent();
  }

  render() {
    return (
      <div className={"search-col search-bar-warp " + this.props.className}>
        <img src="/public/search-logo.png" className="search-logo"></img>
        <Input.Search
          allowClear={true}
          enterButton="搜索"
          onSearch={this.search}
        ></Input.Search>
      </div>
    );
  }
}

export default SearchBar;
