import React from "react";
import { List } from "antd";
import { Link } from "react-router-dom";

class HotSearch extends React.Component {
  constructor(props) {
    super(props);
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
          dataSource={this.props.showHotSearchArray}
          renderItem={(item, index) => (
            <List.Item className="hot-search-item" key={item._id}>
              <List.Item.Meta
                avatar={index + 1}
                title={
                  <Link to={`/search?keyword=${item.word}`}>{item.word}</Link>
                }
              ></List.Item.Meta>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default HotSearch;
