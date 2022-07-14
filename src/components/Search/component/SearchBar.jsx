import React from "react";
import { Input } from "antd";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
    this.state = {
      value: "",
    };
  }

  componentDidMount() {
    const params = this.props.getQueryParams();
    const keyword = decodeURI(params.keyword);
    if (keyword) {
      this.setState({ value: keyword });
    }
  }

  search(value) {
    if (!value) {
      return;
    }
    const params = this.props.getQueryParams();
    const { searchTarget, sortMode, skip } = params;
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
          value={this.state.value}
          onChange={(e) => {
            this.setState({value:e.nativeEvent.target.value})
          }}
          onSearch={this.search}
        ></Input.Search>
      </div>
    );
  }
}

export default SearchBar;
