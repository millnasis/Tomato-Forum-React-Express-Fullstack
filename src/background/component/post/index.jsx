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

const columns = [
  {
    title: "ID",
    dataIndex: "_id",
    key: "_id",
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
    _id: "62c416695beb883da9c44edf",
    title: "我发布的第一个帖子",
    content:
      '<p>内容是学习<span style="font-size: 14px;">😀</span></p><p><span style="font-size: 14px;"><br/></span></p>',
    foundtime: "2022-07-05T10:46:01.339Z",
    lasttime: "2022-07-14T10:25:40.090Z",
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
    comments: [],
    click: 139,
    likeList: ["62c414f95beb883da9c44ede"],
    replyCount: 5,
  },
];

class Post extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="warp">
        <Typography>
          <Title>帖子管理</Title>
          <Divider></Divider>
          <Paragraph>
            <Row gutter={[8, 8]}>
              <Col span={3}></Col>
              <Col span={5}>
                <Input addonBefore="ID"></Input>
              </Col>
              <Col span={5}>
                <Input addonBefore="标题"></Input>
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

export default Post;
