import React from "react";
import formatDate from "../../../tools/LocalDate";
import recommendPostmlHandle from "../../../tools/recommendPostmlHandle.js";
import { Link } from "react-router-dom";
import { List, Button, Skeleton } from "antd";

const defaultLimit = 5;

class PostList extends React.Component {
  constructor(props) {
    super(props);

    this.getMore = this.getMore.bind(this);
  }

  getMore() {
    this.props.get_post_array(this.props.showPostArray.length, defaultLimit);
  }

  render() {
    const loadMore = (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={this.getMore}>加载更多</Button>
      </div>
    );
    return (
      <List
        header={
          <h3>
            <strong>
              <a>{this.props.blockType === "hot" ? "热门帖子" : "最新发帖"}</a>
            </strong>
          </h3>
        }
        className="main-list"
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={this.props.showPostArray}
        renderItem={(item) => (
          <List.Item
            actions={[formatDate(item.lasttime)]}
            style={{ cursor: "pointer" }}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                title={<Link to={`/post/${item.id}`}>{item.title}</Link>}
                description={
                  <Link to={`/post/${item.id}`}>
                    <div
                      className="main-list-description"
                      dangerouslySetInnerHTML={{
                        __html: recommendPostmlHandle(item.content),
                      }}
                    ></div>
                  </Link>
                }
              />
              <div style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                {item.likeCount + "点赞  " + item.replyCount + "回复"}
              </div>
            </Skeleton>
          </List.Item>
        )}
      />
    );
  }
}

export default PostList;
