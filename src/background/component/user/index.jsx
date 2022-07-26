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
  Avatar,
} from "antd";
import { totalUserPermitValue } from "../../reducers/user";
const { Title, Paragraph } = Typography;
const { Option } = Select;



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
        <Button type="primary" style={{marginRight:"5px"}}>修改</Button>
        <Button>删除</Button>
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
    return (
      <div className="warp user">
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

export default User;
