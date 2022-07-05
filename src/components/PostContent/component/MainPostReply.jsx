import React from "react";
import { Comment, Tooltip, Avatar, Button, Divider, Pagination } from "antd";
import { withUseSearchParamsHooksHOC } from "../../../tools/withUseSearchParamsHooksHOC";
import { getQueryVariable } from "../../../tools/getQueryVariable";
import InnerReply from "./InnerReply";

class MainPostReply extends React.Component {
  constructor(props) {
    super(props);

    this.replyLikeHandle = this.replyLikeHandle.bind(this);
  }

  replyLikeHandle(index, event) {
    this.setState({
      list: this.state.list.map((value, _index) =>
        _index === index ? { ...value, isLike: !value.isLike } : value
      ),
    });
  }

  render() {
    // console.log(this.props.showReplyArray);
    return (
      <div className="main-post-reply-warp post-main-col-component">
        <h2>回复</h2>
        <Divider></Divider>
        <InnerReply list={this.props.showReplyArray}></InnerReply>
        {this.props.replySum > 20 && (
          <Pagination
            pageSize={20}
            total={this.props.replySum}
            current={parseInt(getQueryVariable("page")) || 1}
            onChange={(page, pageSize) => {
              const {
                postid,
                get_post_content_body,
                get_show_reply_array,
                setSearchParams,
                defaultLimit,
              } = this.props;
              if (page === 1) {
                get_post_content_body(postid);
              }
              get_show_reply_array(
                postid,
                (page - 1) * defaultLimit,
                defaultLimit
              );
              setSearchParams({ page });
            }}
          ></Pagination>
        )}
      </div>
    );
  }
}

export default withUseSearchParamsHooksHOC(MainPostReply);
