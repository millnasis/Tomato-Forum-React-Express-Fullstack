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
import { totalHotSearchTypeState, totalSortSelectionState } from "../../reducers/hotsearch";
const { Title, Paragraph } = Typography;
const { Option } = Select;

const columns = [
  {
    title: "ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "关键词",
    dataIndex: "word",
    key: "word",
  },
  {
    title: "搜索次数",
    dataIndex: "count",
    key: "count",
  },
  {
    title: "标签",
    key: "type",
    dataIndex: "type",
    render: (v) =>
      v === "control" ? (
        <Tag color={"red"}>受控</Tag>
      ) : (
        <Tag color={"cyan"}>正常</Tag>
      ),
  },
  {
    title: "操作",
    dataIndex: "_id",
    key: "_id",
    render: (v) => (
      <>
        <Button type="primary" style={{ marginRight: "5px" }}>
          修改
        </Button>
        <Button>删除</Button>
      </>
    ),
  },
];

const data = [
  {
    _id: "62cc265cd7f341c9ded617ce",
    word: "龙骧",
    count: 11,
  },
];

class HotSearch extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="warp">
        <Typography>
          <Title>热搜管理</Title>
          <Divider></Divider>
          <Paragraph>
            <Row gutter={[8, 8]}>
              <Col span={3}></Col>
              <Col span={5}>
                <Input addonBefore="关键词"></Input>
              </Col>
              <Col span={4}>
                <Select
                  defaultValue={totalHotSearchTypeState.ALL}
                  style={{ width: "100%" }}
                >
                  <Option key={totalHotSearchTypeState.ALL}>全部</Option>
                  <Option key={totalHotSearchTypeState.CONTROL}>受控</Option>
                  <Option key={totalHotSearchTypeState.NORMAL}>正常</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  defaultValue={totalSortSelectionState.DESC}
                  style={{ width: "100%" }}
                >
                  <Option key={totalSortSelectionState.DESC}>次数降序</Option>
                  <Option key={totalSortSelectionState.ASC}>次数升序</Option>
                </Select>
              </Col>
              <Col span={3}>
                <Button type="primary">查询</Button>
              </Col>
              <Col span={3}>
                <Button>新增热搜 + </Button>
              </Col>
            </Row>
          </Paragraph>
          <Paragraph>
            <Table columns={columns} dataSource={data}></Table>
          </Paragraph>
        </Typography>
      </div>
    );
  }
}

export default HotSearch;
