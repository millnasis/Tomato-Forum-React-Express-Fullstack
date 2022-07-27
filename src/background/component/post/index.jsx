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
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "../../reducers/post";
const { get_background_post_show_array, set_background_post_query } = actions;

const columns = [
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
        <Button type="primary" style={{ marginRight: "5px" }}>
          修改
        </Button>
        <Button>删除</Button>
      </>
    ),
  },
];

class Post extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.get_background_post_show_array();
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
                    this.props.set_background_post_query()
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
              columns={columns}
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);
