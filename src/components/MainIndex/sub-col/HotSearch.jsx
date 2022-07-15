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
            <Link to={`/search?keyword=${item.word}`} key={item._id}>
              <List.Item className="hot-search-item">
                <List.Item.Meta
                  avatar={index + 1}
                  title={item.word}
                ></List.Item.Meta>
              </List.Item>
            </Link>
          )}
        />
      </div>
    );
  }
}

export default HotSearch;
