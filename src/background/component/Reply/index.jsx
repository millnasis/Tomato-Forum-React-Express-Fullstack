import React from "react";
import {
  Typography,
  Divider,
  Input,
  Row,
  Modal,
  Form,
  Popconfirm,
  Alert,
  Col,
  Button,
  Table,
  Avatar,
} from "antd";
const { Title, Paragraph } = Typography;
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import formatDate from "../../tools/LocalDate";
import { actions } from "../../reducers/reply";
import "./index.scss";

const {
  get_background_reply_show_array,
  set_background_reply_query,
  open_update_modal,
  close_update_modal,
  close_comments_update_modal,
  open_comments_update_modal,
} = actions;

class Permit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addLike: "",
      likeList: [],
    };
    this.columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "内容",
        dataIndex: "content",
        key: "content",
        render: (v) => (
          <div
            style={{ maxHeight: "50vh", width: "100%", overflow: "auto" }}
            dangerouslySetInnerHTML={{ __html: v }}
          ></div>
        ),
        ellipsis: true,
      },
      {
        title: "作者",
        dataIndex: "publisher",
        key: "publisher._id",
        render: (v) => (
          <Button
            className="button-warp"
            onClick={() => {
              this.props.set_background_reply_query({
                ...this.props.query,
                publisher: v._id,
              });
              this.props.get_background_reply_show_array(null, {
                ...this.props.query,
                publisher: v._id,
              });
            }}
          >
            {v.username}
          </Button>
        ),
      },
      {
        title: "所属帖子",
        dataIndex: "masterID",
        key: "masterID",
        render: (v) => (
          <Button
            className="button-warp"
            onClick={() => {
              this.props.set_background_reply_query({
                ...this.props.query,
                masterID: v,
              });
              this.props.get_background_reply_show_array(null, {
                ...this.props.query,
                masterID: v,
              });
            }}
          >
            {v}
          </Button>
        ),
      },
      {
        title: "发布时间",
        dataIndex: "foundtime",
        key: "foundtime",
      },
      {
        title: "点赞数",
        dataIndex: "likeList",
        key: "likeList",
        render: (v) => v.length,
      },
      {
        title: "评论",
        dataIndex: "comments",
        key: "comments",
        render: (v) => (
          <Button
            onClick={() => {
              this.props.open_comments_update_modal(v);
            }}
          >
            {v.length + "条评论"}
          </Button>
        ),
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        render: (v) => (
          <>
            <Button
              type="primary"
              style={{ marginRight: "5px", marginBottom: "5px" }}
              onClick={() => this.props.open_update_modal(v)}
            >
              修改
            </Button>
            <Popconfirm
              title="确定要删除吗"
              okText="确定"
              cancelText="取消"
              onConfirm={() => null}
            >
              <Button>删除</Button>
            </Popconfirm>
          </>
        ),
      },
    ];
    this.likeListColumns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        render: (v) => (
          <Popconfirm
            title="确定要删除吗"
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              this.setState({
                likeList: this.state.likeList.filter((e) => e.id !== v),
              });
            }}
          >
            <a>删除</a>
          </Popconfirm>
        ),
      },
    ];
    this.commentsColumns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "内容",
        dataIndex: "content",
        key: "content",
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        render: (v) => (
          <Popconfirm
            title="确定要删除吗"
            okText="确定"
            cancelText="取消"
            // onConfirm={() => {
            //   this.setState({
            //     likeList: this.state.likeList.filter((e) => e.id !== v),
            //   });
            // }}
          >
            <a>删除</a>
          </Popconfirm>
        ),
      },
    ];
  }

  componentDidMount() {
    this.props.get_background_reply_show_array();
  }

  render() {
    console.log(this.props);
    const {
      id,
      content,
      publisher,
      count,
      foundtime,
      comments,
      commentCount,
      masterID,
      likeList,
    } = this.props.modal.target;
    return (
      <div className="warp reply">
        <Modal
          title="修改评论"
          visible={this.props.comments.show}
          onCancel={() => this.props.close_comments_update_modal()}
          footer={null}
        >
          <Table
            columns={this.commentsColumns}
            dataSource={this.props.comments.target}
          ></Table>
        </Modal>
        <Modal
          title="修改回帖"
          visible={this.props.modal.show}
          onCancel={() => this.props.close_update_modal()}
          footer={null}
        >
          <Form
            key={id}
            initialValues={{
              id,
              content,
              publisher: publisher ? publisher._id : "",
              count,
              foundtime: formatDate(foundtime),
              comments,
              commentCount,
              masterID,
              likeList,
            }}
            onFinish={(value) => {
              const obj = {
                ...value,
                likeList: this.state.likeList.map((v) => v.id),
              };
              this.props.update_single_post(
                obj.id,
                obj,
                this.props.query,
                this.props.pagination
              );
              this.props.close_update_modal();
            }}
          >
            <Form.Item label="id" name={"id"}>
              <Input disabled></Input>
            </Form.Item>
            <Form.Item id="content" name={"content"} label="内容">
              <Input.TextArea></Input.TextArea>
            </Form.Item>
            {publisher && (
              <Form.Item
                label="作者"
                id="publisher"
                name="publisher"
                extra={
                  <Alert
                    type="warning"
                    message="该项不建议修改，若一定要修改，用户ID必须输入准确"
                  ></Alert>
                }
              >
                <Input
                  addonBefore={
                    <div>
                      <Avatar src={publisher.head_picture}></Avatar>
                      {" " + publisher.username}
                    </div>
                  }
                ></Input>
              </Form.Item>
            )}
            {foundtime && (
              <Form.Item label="创建时间" id="foundtime" name="foundtime">
                <Input type={"datetime-local"}></Input>
              </Form.Item>
            )}
            <Form.Item label="层数" id="count" name={"count"}>
              <Input type={"number"}></Input>
            </Form.Item>
            <Form.Item label="点赞列表" id="likeList">
              <Input
                addonBefore="添加点赞（用户ID）"
                value={this.state.addLike}
                onChange={(v) =>
                  this.setState({ addLike: v.nativeEvent.target.value })
                }
                addonAfter={
                  <Button
                    style={{ border: "none" }}
                    onClick={() => {
                      if (!this.state.addLike) {
                        return;
                      }
                      this.setState({
                        likeList: [
                          ...this.state.likeList,
                          { id: this.state.addLike },
                        ],
                        addLike: "",
                      });
                    }}
                  >
                    添加
                  </Button>
                }
              ></Input>
              <Table
                columns={this.likeListColumns}
                dataSource={this.state.likeList}
              ></Table>
            </Form.Item>
            <Form.Item>
              <Alert
                type="info"
                message="在您按下修改按钮之前，本页的所有修改都不会保存"
              ></Alert>
            </Form.Item>
            <Form.Item>
              <Row gutter={[8, 8]}>
                <Col offset={16} span={3}>
                  <Button onClick={() => this.props.close_update_modal()}>
                    取消
                  </Button>
                </Col>
                <Col offset={1} span={3}>
                  <Button type="primary" htmlType="submit">
                    修改
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
        <Typography>
          <Title>回帖管理</Title>
          <Divider></Divider>
          <Paragraph>
            <Row gutter={[8, 8]}>
              <Col span={3}></Col>
              <Col span={5}>
                <Input
                  addonBefore="ID"
                  value={this.props.query.id}
                  onChange={(e) =>
                    this.props.set_background_reply_query({
                      ...this.props.query,
                      id: e.nativeEvent.target.value,
                    })
                  }
                ></Input>
              </Col>
              <Col span={5}>
                <Input
                  addonBefore="所属帖子（ID）"
                  value={this.props.query.masterID}
                  onChange={(e) =>
                    this.props.set_background_reply_query({
                      ...this.props.query,
                      masterID: e.nativeEvent.target.value,
                    })
                  }
                ></Input>
              </Col>
              <Col span={5}>
                <Input
                  addonBefore="作者（ID）"
                  value={this.props.query.publisher}
                  onChange={(e) =>
                    this.props.set_background_reply_query({
                      ...this.props.query,
                      publisher: e.nativeEvent.target.value,
                    })
                  }
                ></Input>
              </Col>
              <Col span={3}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.props.get_background_reply_show_array(
                      null,
                      this.props.query
                    );
                  }}
                >
                  查询
                </Button>
                &nbsp;
                <Button
                  onClick={() => {
                    this.props.set_background_reply_query();
                    this.props.get_background_reply_show_array();
                  }}
                >
                  重置
                </Button>
              </Col>
            </Row>
          </Paragraph>
          <Divider></Divider>
          <Paragraph>
            <Table
              columns={this.columns}
              dataSource={this.props.showArray}
              loading={this.props.isFetching}
              pagination={this.props.pagination}
              onChange={(pagination) => {
                this.props.get_background_reply_show_array(
                  pagination,
                  this.props.query
                );
              }}
            ></Table>
          </Paragraph>
        </Typography>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.replyState,
    isFetching: state.globalState.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_background_reply_show_array: bindActionCreators(
      get_background_reply_show_array,
      dispatch
    ),
    set_background_reply_query: bindActionCreators(
      set_background_reply_query,
      dispatch
    ),
    open_update_modal: bindActionCreators(open_update_modal, dispatch),
    close_update_modal: bindActionCreators(close_update_modal, dispatch),
    close_comments_update_modal: bindActionCreators(
      close_comments_update_modal,
      dispatch
    ),
    open_comments_update_modal: bindActionCreators(
      open_comments_update_modal,
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Permit);
