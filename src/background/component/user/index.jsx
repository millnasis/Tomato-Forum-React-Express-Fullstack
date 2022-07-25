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
} from "antd";
const { Title, Paragraph } = Typography;
const { Option } = Select;

const totalUserPermitValue = {
  ALL: "ALL",
  USER: "USER",
  ADMIN: "ADMIN",
};

const columns = [
  {
    title: "ID",
    dataIndex: "ID",
    key: "id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "用户名",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "创建时间",
    dataIndex: "found_time",
    key: "found_time",
  },
  {
    title: "权限",
    key: "permit",
    dataIndex: "permit",
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
            <Table columns={columns}></Table>
          </Paragraph>
        </Typography>
      </div>
    );
  }
}

export default User;
