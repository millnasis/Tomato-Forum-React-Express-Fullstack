import React from "react";
import PostList from "./main-col/PostList";
import Control from "./sub-col/control";
import HotPost from "./sub-col/HotPost";
import { Divider, Modal, Form, Input, Button } from "antd";
import HotSearch from "./sub-col/HotSearch";
import "./css/index.scss";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "../../reducers/mainIndexPage";
import { actions as uiactions } from "../../reducers/ui";
import { actions as rootActions } from "../../reducers/root.js";
import EditorWarp from "../EditorWarp";
const {
  get_hot_post_array,
  get_hot_search,
  get_new_post_array,
  show_edit_board,
  close_edit_board,
  publish_new_post,
  clear_array,
} = actions;
const { show_login_modal } = uiactions;
const { set_message } = rootActions;

const defaultLimit = 2;

class MainIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      html: "",
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value,
    });
  }

  handlePublish(event) {
    const { title, html } = this.state;
    if (!title) {
      this.props.set_message(3, "未填写标题");
      return;
    }
    if (!html) {
      this.props.set_message(3, "未填写内容");
      return;
    }
    const { id } = this.props.userInfo;
    this.props.publish_new_post(title, html, id);
  }

  componentDidMount() {
    document.title = "番茄社区";
    this.props.clear_array();
    this.props.get_hot_post_array(0, defaultLimit);
    this.props.get_new_post_array(0, defaultLimit);
    this.props.get_hot_search();
  }

  render() {
    return (
      <div className="main-index-warp">
        <div className="main-col index-col">
          <Control
            show_edit_board={this.props.show_edit_board}
            show_login_modal={this.props.show_login_modal}
            isUserLogin={this.props.isUserLogin}
            main={true}
            className="main-col-control main-control"
          ></Control>
          <Divider className="main-col-control" />
          <PostList
            showPostArray={this.props.showNewPostArray}
            get_post_array={this.props.get_new_post_array}
            blockType="new"
          ></PostList>
          <Divider />
          <PostList
            get_post_array={this.props.get_hot_post_array}
            showPostArray={this.props.showHotPostArray}
            blockType="hot"
          ></PostList>
        </div>
        <div className="sub-col index-col">
          <Modal
            width={"95vw"}
            title={
              <h3 style={{ textAlign: "center" }}>
                <strong>
                  <a>发布新帖</a>
                </strong>
              </h3>
            }
            visible={this.props.isShowEditBoard}
            footer={null}
            onCancel={() => {
              this.props.close_edit_board();
            }}
          >
            <Form>
              <Form.Item>
                <Input
                  placeholder="输入标题"
                  size="large"
                  onChange={this.handleTitleChange}
                  value={this.state.title}
                ></Input>
              </Form.Item>
              <Divider></Divider>
              <Form.Item>
                <EditorWarp
                  value={this.state.html}
                  onChange={(editor) => {
                    this.setState({ html: editor.getHtml() });
                  }}
                ></EditorWarp>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "8px", width: "120px", float: "right" }}
                  onClick={this.handlePublish}
                  loading={this.props.isFetchingPublishPost}
                >
                  发布
                </Button>
                <Button
                  style={{ marginRight: "8px", width: "120px", float: "right" }}
                  onClick={() => {
                    this.props.close_edit_board();
                  }}
                >
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Control
            show_edit_board={this.props.show_edit_board}
            isUserLogin={this.props.isUserLogin}
            show_login_modal={this.props.show_login_modal}
            className="main-col-control main-control sub-col-component"
          ></Control>
          <HotSearch></HotSearch>
          <HotPost></HotPost>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.mainIndexPageState,
    userInfo: state.globalState.userInfo,
    isUserLogin: state.globalState.isUserLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_hot_post_array: bindActionCreators(get_hot_post_array, dispatch),
    get_hot_search: bindActionCreators(get_hot_search, dispatch),
    get_new_post_array: bindActionCreators(get_new_post_array, dispatch),
    show_edit_board: bindActionCreators(show_edit_board, dispatch),
    close_edit_board: bindActionCreators(close_edit_board, dispatch),
    publish_new_post: bindActionCreators(publish_new_post, dispatch),
    show_login_modal: bindActionCreators(show_login_modal, dispatch),
    clear_array: bindActionCreators(clear_array, dispatch),
    set_message: bindActionCreators(set_message, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainIndex);
