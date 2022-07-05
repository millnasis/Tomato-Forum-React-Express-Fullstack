import React from "react";
import { Card, Divider } from "antd";

class HotPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: ["热", "热", "热", "热", "热", "热"],
    };
  }

  render() {
    return (
      <div className="hot-post-warp sub-col-component">
        <strong>热门帖子</strong>
        <Divider></Divider>
        {this.state.list.map((item, index) => {
          return (
            <Card
              key={item + index}
              size="small"
              className="hot-post-list-item"
              style={{ maxHeight: 100, overflow: "hidden" }}
            >
              <p>{item}</p>
              <p>{item}</p>
              <p>{item}</p>
              <p>{item}</p>
              <p>{item}</p>
            </Card>
          );
        })}
      </div>
    );
  }
}

export default HotPost;
