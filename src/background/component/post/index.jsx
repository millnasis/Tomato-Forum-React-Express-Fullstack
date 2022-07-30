import React from "react";
import {
  Typography,
  Divider,
  Input,
  Row,
  Col,
  Button,
  Select,
  Table,
  Tag,
  Form,
  Modal,
  Avatar,
  Alert,
  DatePicker,
} from "antd";
const { Title, Paragraph } = Typography;
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "../../reducers/post";
import formatDate from "../../tools/LocalDate";

const {
  get_background_post_show_array,
  set_background_post_query,
  open_update_modal,
  close_update_modal,
  update_single_post,
  delete_single_post,
} = actions;

class Post extends React.Component {
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
        title: "标题",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "作者",
        dataIndex: "publisher",
        key: "publisher._id",
        render: (v) => v.username,
      },
      {
        title: "创建时间",
        dataIndex: "foundtime",
        key: "foundtime",
      },
      {
        title: "点击量",
        dataIndex: "click",
        key: "click",
      },
      {
        title: "点赞数",
        dataIndex: "likeList",
        key: "likeList",
        render: (v) => v.length,
      },
      {
        title: "回帖量",
        dataIndex: "replyCount",
        key: "replyCount",
      },
      {
        title: "操作",
        dataIndex: "id",
        key: "id",
        render: (v) => (
          <>
            <Button
              type="primary"
              style={{ marginRight: "5px" }}
              onClick={() => this.props.open_update_modal(v)}
            >
              修改
            </Button>
            <Button
              onClick={() =>
                this.props.delete_single_post(
                  v,
                  this.props.query,
                  this.props.pagination
                )
              }
            >
              删除
            </Button>
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
          <a
            onClick={() => {
              this.setState({
                likeList: this.state.likeList.filter((e) => e.id !== v),
              });
            }}
          >
            删除
          </a>
        ),
      },
    ];
  }

  componentDidMount() {
    this.props.get_background_post_show_array();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.modal.target !== this.props.modal.target &&
      this.props.modal.target.likeList
    ) {
      this.setState({
        likeList: this.props.modal.target.likeList.map((v) => {
          return { id: v };
        }),
      });
    }
  }

  render() {
    const {
      id,
      title,
      publisher,
      foundtime,
      lasttime,
      click,
      replyCount,
      content,
    } = this.props.modal.target;
    return (
      <div className="warp">
        <Modal
          title="修改帖子"
          visible={this.props.modal.show}
          onCancel={() => this.props.close_update_modal()}
          footer={null}
        >
          <Form
            key={id}
            initialValues={{
              id,
              title,
              publisher: publisher ? publisher._id : "",
              foundtime: formatDate(foundtime),
              lasttime: formatDate(lasttime),
              click,
              content,
              replyCount,
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
            <Form.Item id="title" name="title" label="标题">
              <Input></Input>
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
            {lasttime && (
              <Form.Item label="上次更新" id="lasttime" name="lasttime">
                <Input type={"datetime-local"}></Input>
              </Form.Item>
            )}
            <Form.Item
              label="点击量"
              id="click"
              name={"click"}
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              <Input type={"number"}></Input>
            </Form.Item>
            <Form.Item
              label="回帖计数"
              id="replyCount"
              name={"replyCount"}
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
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
          <Title>帖子管理</Title>
          <Divider></Divider>
          <Paragraph>
            <Row gutter={[8, 8]}>
              <Col span={3}></Col>
              <Col span={5}>
                <Input
                  addonBefore="ID"
                  value={this.props.query.id}
                  onChange={(e) => {
                    this.props.set_background_post_query({
                      ...this.props.query,
                      id: e.nativeEvent.target.value,
                    });
                  }}
                ></Input>
              </Col>
              <Col span={5}>
                <Input
                  addonBefore="标题"
                  value={this.props.query.title}
                  onChange={(e) => {
                    this.props.set_background_post_query({
                      ...this.props.query,
                      title: e.nativeEvent.target.value,
                    });
                  }}
                ></Input>
              </Col>
              <Col span={5}>
                <Input
                  addonBefore="作者（ID）"
                  value={this.props.query.publisher}
                  onChange={(e) => {
                    this.props.set_background_post_query({
                      ...this.props.query,
                      publisher: e.nativeEvent.target.value,
                    });
                  }}
                ></Input>
              </Col>
              <Col span={3}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.props.get_background_post_show_array(
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
                    this.props.set_background_post_query();
                    this.props.get_background_post_show_array();
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
                this.props.get_background_post_show_array(
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
    ...state.postState,
    isFetching: state.globalState.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_background_post_show_array: bindActionCreators(
      get_background_post_show_array,
      dispatch
    ),
    set_background_post_query: bindActionCreators(
      set_background_post_query,
      dispatch
    ),
    open_update_modal: bindActionCreators(open_update_modal, dispatch),
    close_update_modal: bindActionCreators(close_update_modal, dispatch),
    update_single_post: bindActionCreators(update_single_post, dispatch),
    delete_single_post: bindActionCreators(delete_single_post, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);
