import React from "react";
import { List, Pagination, Divider } from "antd";
import formatDate from "../../../tools/LocalDate.js";
import htmlToText from "../../../tools/htmlToText";

const singlePageLimit = 10;

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="search-col search-result">
        <List
          dataSource={this.props.showArray}
          renderItem={(item, index) => {
            return (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div className="search-result-title">{item.title}</div>
                  }
                  description={
                    <div className="search-result-content">
                      {htmlToText(item.content)}
                    </div>
                  }
                ></List.Item.Meta>
                <div className="search-result-info">
                  {`${formatDate(item.foundtime)}   ${
                    item.likeList.length
                  }点赞   ${item.replyCount}回复   收藏   ${item.click}浏览`}
                </div>
              </List.Item>
            );
          }}
        ></List>
        {this.sum > singlePageLimit && (
          <Pagination
            total={this.props.sum}
            pageSize={singlePageLimit}
          ></Pagination>
        )}
        <Divider></Divider>
      </div>
    );
  }
}

export default SearchResult;
