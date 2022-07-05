import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "../../../reducers/userInfoPage";
import formatDate from "../../../tools/LocalDate";
import htmlToText from "../../../tools/htmlToText";
const {
  get_show_user_comment_array,
  get_show_user_post_array,
  get_show_user_reply_array,
  get_show_user_favorite_array,
} = actions;
import { Tabs, List, Pagination } from "antd";
import { Link } from "react-router-dom";

const singlePageLimit = 10;

class UserPostRecords extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nowTabKey: "1",
    };

    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(key) {
    if (key === this.state.nowTabKey) {
      return;
    }
    const { userid } = this.props;
    if (key === "1") {
      this.props.get_show_user_post_array(userid, 0);
    } else if (key === "2") {
      this.props.get_show_user_reply_array(userid, 0);
    } else if (key === "3") {
      this.props.get_show_user_comment_array(userid, 0);
    } else if (key === "4") {
      this.props.get_show_user_favorite_array(userid, 0);
    }
    this.setState({
      nowTabKey: key,
    });
  }

  componentDidMount() {
    this.props.get_show_user_post_array(this.props.userid, 0);
  }

  render() {
    return (
      <div className="user-info-main-col-component">
        <Tabs defaultActiveKey="1" onChange={this.switchTab}>
          <Tabs.TabPane tab="发帖" key="1">
            {this.state.nowTabKey === "1" && (
              <List
                dataSource={this.props.showUserPostArray}
                renderItem={(item) => {
                  return (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div className="titleEllipsis">
                            <Link to={`/post/${item.id}`}>
                              {htmlToText(item.title)}
                            </Link>
                          </div>
                        }
                        description={
                          <div className="contentEllipsis">
                            {htmlToText(item.content)}
                          </div>
                        }
                      ></List.Item.Meta>
                      <span style={{ color: "gray" }}>
                        {formatDate(item.foundtime)}
                      </span>
                    </List.Item>
                  );
                }}
              >
                {this.props.showUserPostArraySum > singlePageLimit && (
                  <Pagination
                    total={this.props.showUserPostArraySum}
                    pageSize={singlePageLimit}
                    onChange={(page, pageSize) => {
                      const { userid } = this.props;
                      let skip = (page - 1) * pageSize;
                      this.props.get_show_user_post_array(userid, skip);
                    }}
                  ></Pagination>
                )}
              </List>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="回复" key="2">
            {this.state.nowTabKey === "2" && (
              <List
                dataSource={this.props.showUserReplyArray}
                renderItem={(item) => {
                  return (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div>
                            回复帖子{" "}
                            <Link to={`/post/${item.masterID}`}>
                              {item.master.title}
                            </Link>
                          </div>
                        }
                        description={
                          <div className="contentEllipsis">
                            {htmlToText(item.content)}
                          </div>
                        }
                      ></List.Item.Meta>
                      <span style={{ color: "gray" }}>
                        {formatDate(item.foundtime)}
                      </span>
                    </List.Item>
                  );
                }}
              >
                {this.props.showUserReplyArraySum > singlePageLimit && (
                  <Pagination
                    total={this.props.showUserReplyArraySum}
                    pageSize={singlePageLimit}
                    onChange={(page, pageSize) => {
                      const { userid } = this.props;
                      let skip = (page - 1) * pageSize;
                      this.props.get_show_user_reply_array(userid, skip);
                    }}
                  ></Pagination>
                )}
              </List>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="评论" key="3">
            {this.state.nowTabKey === "3" && (
              <List
                dataSource={this.props.showUserCommentArray}
                renderItem={(item) => {
                  return (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div className="titleEllipsis">
                            评论回复{" "}
                            <Link to={`/post/${item.master.masterID}`}>
                              {htmlToText(item.master.content)}
                            </Link>
                          </div>
                        }
                        description={
                          <div className="contentEllipsis">
                            {htmlToText(item.content)}
                          </div>
                        }
                      ></List.Item.Meta>
                      <span style={{ color: "gray" }}>
                        {formatDate(item.foundtime)}
                      </span>
                    </List.Item>
                  );
                }}
              >
                {this.props.showUserCommentArraySum > singlePageLimit && (
                  <Pagination
                    total={this.props.showUserCommentArraySum}
                    pageSize={singlePageLimit}
                    onChange={(page, pageSize) => {
                      const { userid } = this.props;
                      let skip = (page - 1) * pageSize;
                      this.props.get_show_user_comment_array(userid, skip);
                    }}
                  ></Pagination>
                )}
              </List>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="收藏" key="4">
            {this.state.nowTabKey === "4" && (
              <List
                dataSource={this.props.showUserFavoriteArray}
                renderItem={(item) => {
                  const { post, foundtime, postid } = item;
                  const { content, title } = post;
                  return (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div className="titleEllipsis">
                            <Link to={`/post/${postid}`}>
                              {htmlToText(title)}
                            </Link>
                          </div>
                        }
                        description={
                          <div className="contentEllipsis">
                            {htmlToText(content)}
                          </div>
                        }
                      ></List.Item.Meta>
                      <span style={{ color: "gray" }}>
                        {"收藏于" + formatDate(foundtime)}
                      </span>
                    </List.Item>
                  );
                }}
              >
                {this.props.showUserFavoriteArraySum > singlePageLimit && (
                  <Pagination
                    total={this.props.showUserFavoriteArraySum}
                    pageSize={singlePageLimit}
                  ></Pagination>
                )}
              </List>
            )}
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.userInfoPageState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_show_user_comment_array: bindActionCreators(
      get_show_user_comment_array,
      dispatch
    ),
    get_show_user_favorite_array: bindActionCreators(
      get_show_user_favorite_array,
      dispatch
    ),
    get_show_user_post_array: bindActionCreators(
      get_show_user_post_array,
      dispatch
    ),
    get_show_user_reply_array: bindActionCreators(
      get_show_user_reply_array,
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPostRecords);
