import React from "react";
import { withUseSearchParamsHooksHOC } from "../../../tools/withUseSearchParamsHooksHOC";
import ReactWEditor from "wangeditor-for-react";
import { Divider, Button } from "antd";

class WriteBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      html: "",
    };

    this.SubmitHandle = this.SubmitHandle.bind(this);
  }

  SubmitHandle() {
    if (!this.props.isUserLogin) {
      this.props.show_login_modal();
    }
    if (!this.state.html) {
      return;
    }
    const { postContentBody, userInfo } = this.props;
    this.props.post_new_reply(
      postContentBody.id,
      userInfo.id,
      this.state.html
    );
  }

  componentDidUpdate(prevProp) {
    if (
      prevProp.responseToPostReply !== this.props.responseToPostReply &&
      this.props.responseToPostReply
    ) {
      const { defaultLimit, replySum } = this.props;
      this.props.setSearchParams({
        page: Math.ceil(replySum / defaultLimit),
      });
      window.location.reload();
    }
  }

  render() {
    return (
      <div className="post-main-col-component main-post-content-control">
        <h2>发表回复</h2>
        <Divider></Divider>
        <ReactWEditor
          onChange={(html) => {
            this.setState({ html });
          }}
        ></ReactWEditor>
        <div className="main-post-content-control-botton-warp">
          <Button
            className="main-post-content-control-botton"
            size="large"
            type="primary"
            onClick={this.SubmitHandle}
          >
            发布
          </Button>
        </div>
      </div>
    );
  }
}

export default withUseSearchParamsHooksHOC(WriteBoard);
