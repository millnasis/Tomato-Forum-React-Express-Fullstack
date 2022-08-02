import React from "react";
import {
  Typography,
  Divider,
  Input,
  Row,
  Modal,
  Form,
  Popconfirm,
  Tag,
  Select,
  Alert,
  Col,
  Button,
  Table,
  Avatar,
} from "antd";
import { totalUserPermitValue, sexState } from "../../reducers/user";
import { bindActionCreators } from "redux";
import formatDate from "../../tools/LocalDate";
import { actions } from "../../reducers/user";
import { connect } from "react-redux";
const { Title, Paragraph } = Typography;
const { Option } = Select;

const {
  close_update_modal,
  delete_single_user,
  get_background_user_show_array,
  open_update_modal,
  update_single_user,
  set_background_user_pagination,
  set_background_user_query,
} = actions;

const columns = [
  {
    title: "头像",
    dataIndex: "head_picture",
    key: "head_picture",
    render: (v) => <Avatar src={v} size="large"></Avatar>,
  },
  {
    title: "ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "用户名",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
  },
  {
    title: "创建时间",
    dataIndex: "foundtime",
    key: "foundtime",
  },
  {
    title: "权限",
    key: "permit",
    dataIndex: "permit",
    render: (v) => (v === "user" ? <Tag>{v}</Tag> : <Tag>别的</Tag>),
  },
  {
    title: "操作",
    dataIndex: "_id",
    key: "_id",
    render: (v) => (
      <>
        <Button
          type="primary"
          style={{ marginRight: "5px", marginBottom: "5px" }}
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

const data = [
  {
    _id: "62c414f95beb883da9c44ede",
    username: "MillNasis",
    head_picture: "/public/img/75626274_p0.jpg",
    words: "我是嫩爹啊我是嫩爹啊我是嫩爹啊我是嫩爹啊我是嫩爹啊我是嫩爹啊",
    age: 0,
    foundtime: "2022-07-05T10:39:53.097Z",
    likeCount: 4,
    email: "1985551393@qq.com",
    sex: "男",
    permit: "user",
  },
  {
    _id: "62c414f95beb883da9c44ede",
    username: "MillNasis",
    head_picture: "/public/img/75626274_p0.jpg",
    words: "我是嫩爹啊我是嫩爹啊我是嫩爹啊我是嫩爹啊我是嫩爹啊我是嫩爹啊",
    age: 0,
    foundtime: "2022-07-05T10:39:53.097Z",
    likeCount: 4,
    email: "1985551393@qq.com",
    sex: "男",
    permit: "user",
  },
];

class User extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      _id,
      username,
      head_picture,
      word,
      age,
      foundtime,
      likeCount,
      email,
      sex,
      permit,
    } = this.props.modal.target;
    return (
      <div className="warp user">
        <Modal
          title="修改回帖"
          visible={this.props.modal.show}
          onCancel={() => this.props.close_update_modal()}
          footer={null}
        >
          <Form
            key={_id}
            initialValues={{
              _id,
              username,
              head_picture,
              word,
              age,
              foundtime,
              likeCount,
              email,
              sex,
              permit,
            }}
            onFinish={(value) => {}}
          >
            <Form.Item label="ID" name={"id"}>
              <Input disabled></Input>
            </Form.Item>
            <Form.Item
              label="用户名"
              name={"username"}
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              label="头像地址"
              name={"head_picture"}
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              label="性别"
              name={"sex"}
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              <Select>
                <Option value={sexState.male}>男</Option>
                <Option value={sexState.female}>女</Option>
                <Option value={sexState.none}>未选择</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="年龄"
              name={"age"}
              style={{ display: "inline-block", width: "calc(50% - 12px)" }}
            >
              <Input type={"number"}></Input>
            </Form.Item>
            <Form.Item id="email" name={"email"} label="电子邮箱">
              <Input type={"email"}></Input>
            </Form.Item>
            <Form.Item id="words" name={"words"} label="个性签名">
              <Input.TextArea></Input.TextArea>
            </Form.Item>
            {foundtime && (
              <Form.Item label="创建时间" id="foundtime" name="foundtime">
                <Input type={"datetime-local"}></Input>
              </Form.Item>
            )}
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
          <Title>用户管理</Title>
          <Divider></Divider>
          <Paragraph>
            <Row gutter={[8, 8]}>
              <Col span={3}></Col>
              <Col span={5}>
                <Input addonBefore="ID"></Input>
              </Col>
              <Col span={5}>
                <Input addonBefore="用户名"></Input>
              </Col>
              <Col span={5}>
                <Select
                  defaultValue={totalUserPermitValue.ALL}
                  style={{ width: "100%" }}
                >
                  <Option key={totalUserPermitValue.ALL}>全部</Option>
                  <Option key={totalUserPermitValue.USER}>普通用户</Option>
                  <Option key={totalUserPermitValue.ADMIN}>管理员</Option>
                </Select>
              </Col>
              <Col span={3}>
                <Button type="primary">搜索</Button>
              </Col>
            </Row>
          </Paragraph>
          <Divider></Divider>
          <Paragraph>
            <Table columns={columns} dataSource={data}></Table>
          </Paragraph>
        </Typography>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.userState,
    isFetching: state.globalState.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    close_update_modal: bindActionCreators(close_update_modal, dispatch),
    delete_single_user: bindActionCreators(delete_single_user, dispatch),
    get_background_user_show_array: bindActionCreators(
      get_background_user_show_array,
      dispatch
    ),
    open_update_modal: bindActionCreators(open_update_modal, dispatch),
    update_single_user: bindActionCreators(update_single_user, dispatch),
    set_background_user_pagination: bindActionCreators(
      set_background_user_pagination,
      dispatch
    ),
    set_background_user_query: bindActionCreators(
      set_background_user_query,
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
