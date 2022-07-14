import React from "react";
import { Card, Divider } from "antd";
import { Link } from "react-router-dom";
import clickPoshtmlHandle from "../../../tools/recommendPostmlHandle.js";

class HotPost extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { showClickPostArray } = this.props;
    return (
      <div className="hot-post-warp sub-col-component">
        <strong>其他人正在看</strong>
        <Divider></Divider>
        {showClickPostArray.map((item, index) => {
          return (
            <Link to={`/post/${item.id}`} key={item.id}>
              <Card
                size="small"
                className="hot-post-list-item"
                style={{ overflow: "hidden" }}
                extra={
                  <div style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                    {item.click +
                      "浏览 " +
                      item.likeCount +
                      "点赞  " +
                      item.replyCount +
                      "回复"}
                  </div>
                }
                title={<strong>{item.title}</strong>}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: clickPoshtmlHandle(item.content),
                  }}
                ></div>
              </Card>
            </Link>
          );
        })}
      </div>
    );
  }
}

export default HotPost;
