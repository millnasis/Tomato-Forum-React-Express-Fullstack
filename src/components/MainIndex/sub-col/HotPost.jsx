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
            <Link to={`/post/${item.id}`}>
              <Card
                key={item.id}
                size="small"
                className="hot-post-list-item"
                style={{ overflow: "hidden" }}
              >
                <h4>{item.title}</h4>
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
