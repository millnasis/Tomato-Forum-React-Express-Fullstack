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

const columns = [
  {
    title: "ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "内容",
    dataIndex: "content",
    key: "content",
    render: (v) => <div dangerouslySetInnerHTML={{ __html: v }}></div>,
    ellipsis: true,
  },
  {
    title: "作者",
    dataIndex: "publisher",
    key: "publisher._id",
    render: (v) => v.username,
  },
  {
    title: "所属帖子",
    dataIndex: "masterID",
    key: "masterID",
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
    render: (v) => <Button>{v.length + "条评论"}</Button>,
  },
  {
    title: "操作",
    dataIndex: "_id",
    key: "_id",
    render: (v) => (
      <>
        <Button type="primary" style={{ marginBottom: "5px" }}>
          修改
        </Button>
        <br />
        <Button>删除</Button>
      </>
    ),
  },
];

const data = [
  {
    _id: "62c4167f5beb883da9c44ee1",

    content:
      '<p>内容是学习<span style="font-size: 14px;">😀</span></p><p><span style="font-size: 14px;"><br/></span></p>',
    foundtime: "2022-07-05T10:46:23.551Z",
    publisher: {
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
    comments: [
      {
        id: "62c561b921a1bfd112ff49d71657113456371",
        content: "<p>叼你妈的锄头，夜晚偷绿豆</p>",
        foundtime: "2022-07-06T13:17:36.371Z",

        publisher: "62c561b921a1bfd112ff49d7",
        likeList: [],
        masterID: "62c4167f5beb883da9c44ee1",

        isMention: false,
        mentionID: null,
        mentionUser: "62c58b705287df0026f144d7",
      },
      {
        id: "62c414f95beb883da9c44ede1657113664971",
        content: "<p>歇息啦你</p>",
        foundtime: {
          $date: "2022-07-06T13:21:04.971Z",
        },
        publisher: "62c414f95beb883da9c44ede",
        likeList: ["62c414f95beb883da9c44ede"],
        masterID: {
          $oid: "62c4167f5beb883da9c44ee1",
        },
        isMention: true,
        mentionID: "62c561b921a1bfd112ff49d71657113456371",
        mentionUser: {
          $oid: "62c561b921a1bfd112ff49d7",
        },
      },
    ],
    likeList: ["62c561b921a1bfd112ff49d7", "62c414f95beb883da9c44ede"],
    count: 1,
    masterID: "62c416695beb883da9c44edf",
  },
];

class Permit extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="warp">
        <Typography>
          <Title>回帖管理</Title>
          <Divider></Divider>
          <Paragraph>
            <Row gutter={[8, 8]}>
              <Col span={3}></Col>
              <Col span={5}>
                <Input addonBefore="ID"></Input>
              </Col>
              <Col span={5}>
                <Input addonBefore="所属帖子（ID）"></Input>
              </Col>
              <Col span={5}>
                <Input addonBefore="作者（ID）"></Input>
              </Col>
              <Col span={3}>
                <Button type="primary">查询</Button>
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

export default Permit;
