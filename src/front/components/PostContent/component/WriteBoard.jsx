import React from "react";
import { withUseSearchParamsHooksHOC } from "../../../tools/withUseSearchParamsHooksHOC";
import { Divider, Button } from "antd";
import EditorWarp from "../../EditorWarp";

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
    this.props.post_new_reply(postContentBody.id, userInfo.id, this.state.html);
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
    if(prevProp.focusWriteBoard !== this.props.focusWriteBoard && this.props.focusWriteBoard){
      this.props.change_focus_write_board(false);
    }
  }

  render() {
    return (
      <div className="post-main-col-component main-post-content-control">
        <h2>发表回复</h2>
        <Divider></Divider>
        <EditorWarp
          focus={this.props.focusWriteBoard}
          value={this.state.html}
          onChange={(editor) => {
            this.setState({ html: editor.getHtml() });
          }}
        ></EditorWarp>
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
