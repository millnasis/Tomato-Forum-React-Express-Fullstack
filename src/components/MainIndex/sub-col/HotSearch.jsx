import React from "react";
import { List } from "antd";

class HotSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: ["我", "你", "他"],
    };
  }

  render() {
    return (
      <div className="hot-search sub-col-component">
        <List
          header={
            <div>
              <strong>热门搜索</strong>
            </div>
          }
          bordered
          dataSource={this.state.list}
          renderItem={(item) => (
            <List.Item className="hot-search-item list-item-point">{item}</List.Item>
          )}
        />
      </div>
    );
  }
}

export default HotSearch;
