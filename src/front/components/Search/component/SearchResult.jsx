import React from "react";
import { List, Pagination, Divider, Card, Avatar } from "antd";
import formatDate from "../../../tools/LocalDate.js";
import htmlToText from "../../../tools/htmlToText";
import { consoleDebugTool } from "../../../tools/consoleDebugTool";

import { Link } from "react-router-dom";

const singlePageLimit = 10;

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    consoleDebugTool("搜索", this.props);
    const params = this.props.getQueryParams();
    const { skip } = params;
    return (
      <div className="search-col search-result">
        {this.props.searchTarget === this.props.totalSearchTarget.POST ? (
          <List
            dataSource={this.props.showArray}
            renderItem={(item) => {
              return (
                <Link to={`/post/${item._id}`} key={item._id}>
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
                        Array.isArray(item.likeList) ? item.likeList.length : 0
                      }点赞   ${item.replyCount}回复   收藏   ${
                        item.click
                      }浏览`}
                    </div>
                  </List.Item>
                </Link>
              );
            }}
          ></List>
        ) : (
          <List
            dataSource={this.props.showArray}
            renderItem={(item) => {
              return (
                <Link to={`/user/${item._id}`} key={item._id}>
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src={item.head_picture} size="large"></Avatar>
                      }
                      title={
                        <div className="search-result-title">
                          {item.username}
                        </div>
                      }
                      description={
                        <div className="search-result-content">
                          个性签名：{item.words}
                        </div>
                      }
                    ></List.Item.Meta>
                    <div className="search-result-info">
                      {`${item.likeCount}点赞   ${item.followCount}粉丝`}
                    </div>
                  </List.Item>
                </Link>
              );
            }}
          ></List>
        )}
        {this.props.sum > singlePageLimit && (
          <Pagination
            total={this.props.sum}
            pageSize={singlePageLimit}
            defaultCurrent={+skip / singlePageLimit + 1}
            onChange={(page, pageSize) => {
              const params = this.props.getQueryParams();
              const { searchTarget, sortMode, keyword } = params;
              const decodeKeyword = decodeURI(keyword);
              this.props.setSearchParams({
                ...params,
                keyword: decodeKeyword,
                skip: (page - 1) * singlePageLimit,
              });
              this.props.send_to_search(
                decodeKeyword,
                searchTarget,
                sortMode,
                (page - 1) * singlePageLimit
              );
            }}
          ></Pagination>
        )}
        <Divider></Divider>
      </div>
    );
  }
}

export default SearchResult;
