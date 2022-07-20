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
  get_show_user_follow_array,
  get_show_who_follow_user_array,
} = actions;
import { Tabs, List, Pagination } from "antd";
import { Link } from "react-router-dom";

const singlePageLimit = 10;

const tabKey = {
  POST: "POST",
  REPLY: "REPLY",
  COMMENT: "COMMENT",
  FAVORITE: "FAVORITE",
  FOLLOW: "FOLLOW",
  BEFOLLOW: "BEFOLLOW",
};

class UserPostRecords extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nowTabKey: tabKey.POST,
    };

    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(key) {
    if (key === this.state.nowTabKey) {
      return;
    }
    const { userid } = this.props;
    switch (key) {
      case tabKey.POST:
        this.props.get_show_user_post_array(userid, 0);
        break;
      case tabKey.REPLY:
        this.props.get_show_user_reply_array(userid, 0);
        break;
      case tabKey.COMMENT:
        this.props.get_show_user_comment_array(userid, 0);
        break;
      case tabKey.FAVORITE:
        this.props.get_show_user_favorite_array(userid, 0);
        break;
      case tabKey.FOLLOW:
        this.props.get_show_user_follow_array(userid, 0);
        break;
      case tabKey.BEFOLLOW:
        this.props.get_show_who_follow_user_array(userid, 0);
        break;

      default:
        break;
    }
    this.setState({
      nowTabKey: key,
    });
  }

  componentDidMount() {
    this.props.get_show_user_post_array(this.props.userid, 0);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.userid !== this.props.userid) {
      const { userid } = this.props;
      switch (this.state.nowTabKey) {
        case tabKey.POST:
          this.props.get_show_user_post_array(userid, 0);
          break;
        case tabKey.REPLY:
          this.props.get_show_user_reply_array(userid, 0);
          break;
        case tabKey.COMMENT:
          this.props.get_show_user_comment_array(userid, 0);
          break;
        case tabKey.FAVORITE:
          this.props.get_show_user_favorite_array(userid, 0);
          break;
        case tabKey.FOLLOW:
          this.props.get_show_user_follow_array(userid, 0);
          break;
        case tabKey.BEFOLLOW:
          this.props.get_show_who_follow_user_array(userid, 0);
          break;

        default:
          break;
      }
    }
  }

  render() {
    console.log(this.props);
    return (
      <div className="user-info-main-col-component">
        <Tabs defaultActiveKey={tabKey.POST} onChange={this.switchTab}>
          <Tabs.TabPane tab="发帖" key={tabKey.POST}>
            {this.state.nowTabKey === tabKey.POST && (
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
          <Tabs.TabPane tab="回复" key={tabKey.REPLY}>
            {this.state.nowTabKey === tabKey.REPLY && (
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
          <Tabs.TabPane tab="评论" key={tabKey.COMMENT}>
            {this.state.nowTabKey === tabKey.COMMENT && (
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
          <Tabs.TabPane tab="收藏" key={tabKey.FAVORITE}>
            {this.state.nowTabKey === tabKey.FAVORITE && (
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
          <Tabs.TabPane tab="我关注的" key={tabKey.FOLLOW}>
            {this.state.nowTabKey === tabKey.FOLLOW && (
              <List
                dataSource={this.props.showUserFollowArray}
                renderItem={(item) => {
                  // const { post, foundtime, postid } = item;
                  // const { content, title } = post;
                  // return (
                  //   <List.Item>
                  //     <List.Item.Meta
                  //       title={
                  //         <div className="titleEllipsis">
                  //           <Link to={`/post/${postid}`}>
                  //             {htmlToText(title)}
                  //           </Link>
                  //         </div>
                  //       }
                  //       description={
                  //         <div className="contentEllipsis">
                  //           {htmlToText(content)}
                  //         </div>
                  //       }
                  //     ></List.Item.Meta>
                  //     <span style={{ color: "gray" }}>
                  //       {"收藏于" + formatDate(foundtime)}
                  //     </span>
                  //   </List.Item>
                  // );
                  return <div>fuck</div>;
                }}
              >
                {this.props.showUserFollowArraySum > singlePageLimit && (
                  <Pagination
                    total={this.props.showUserFollowArraySum}
                    pageSize={singlePageLimit}
                  ></Pagination>
                )}
              </List>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="关注我的" key={tabKey.BEFOLLOW}>
            {this.state.nowTabKey === tabKey.BEFOLLOW && (
              <List
                dataSource={this.props.showWhoFollowUserArray}
                renderItem={(item) => {
                  // const { post, foundtime, postid } = item;
                  // const { content, title } = post;
                  // return (
                  //   <List.Item>
                  //     <List.Item.Meta
                  //       title={
                  //         <div className="titleEllipsis">
                  //           <Link to={`/post/${postid}`}>
                  //             {htmlToText(title)}
                  //           </Link>
                  //         </div>
                  //       }
                  //       description={
                  //         <div className="contentEllipsis">
                  //           {htmlToText(content)}
                  //         </div>
                  //       }
                  //     ></List.Item.Meta>
                  //     <span style={{ color: "gray" }}>
                  //       {"收藏于" + formatDate(foundtime)}
                  //     </span>
                  //   </List.Item>
                  // );
                  return <div>fuck</div>;
                }}
              >
                {this.props.showWhoFollowUserArraySum > singlePageLimit && (
                  <Pagination
                    total={this.props.showWhoFollowUserArraySum}
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
    get_show_user_follow_array: bindActionCreators(
      get_show_user_follow_array,
      dispatch
    ),
    get_show_who_follow_user_array: bindActionCreators(
      get_show_who_follow_user_array,
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPostRecords);
