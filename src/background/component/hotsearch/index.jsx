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
import { totalSortSelectionState } from "../../reducers/hotsearch";
import formatDate from "../../tools/LocalDate";
import { MenuOutlined } from "@ant-design/icons";
import { arrayMoveImmutable } from "array-move";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
const { Title, Paragraph } = Typography;
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actions } from "../../reducers/hotsearch";
const {
  delete_single_hot_search,
  get_background_hot_search_show_array,
  set_background_hot_search_pagination,
  set_background_hot_search_query,
  update_single_hot_search,
  close_update_modal,
  open_update_modal,
} = actions;
import "./index.scss";

const { Option } = Select;

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: "grab",
      color: "#999",
    }}
  />
));

const columns = [
  {
    title: "拖拽排序",
    dataIndex: "sort",
    className: "drag-visible",
    render: () => <DragHandle />,
  },
  {
    title: "关键词",
    dataIndex: "word",
    className: "drag-visible",
  },
  {
    title: "搜索次数",
    dataIndex: "count",
  },
  {
    title: "标签",
    dataIndex: "type",
    render: () => <Tag color={"red"}>受控</Tag>,
  },
  {
    title: "操作",
    dataIndex: "action",
    render: () => (
      <>
        <Button
          type="primary"
          style={{ marginRight: "5px", marginBottom: "5px" }}
        >
          修改
        </Button>
        <Button>删除</Button>
      </>
    ),
  },
];
const data = [
  {
    word: "我的",
    key: 0,
    index: 0,
  },
  {
    word: "他的",
    key: 1,
    index: 1,
  },
  {
    word: "你的",
    key: 2,
    index: 2,
  },
];

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

class HotSearch extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
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
            <Button
              type="primary"
              style={{ marginRight: "5px", marginBottom: "5px" }}
            >
              修改
            </Button>
            <Button>删除</Button>
          </>
        ),
      },
    ];

    this.state = {
      dataSource: data,
      normalModalState: false,
      controlModalState: false,
      controlWordSortState: false,
    };
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        this.state.dataSource.slice(),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      this.setState({ dataSource: newData, controlWordSortState: true });
    }
  };
  DraggableContainer = (props) => {
    return (
      <SortableBody
        useDragHandle
        disableAutoscroll
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd}
        {...props}
      />
    );
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = this.state.dataSource.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const { _id, word, count } = this.props.modal.target;
    return (
      <div className="warp hot-search">
        <Modal
          title="新增普通热搜"
          visible={this.state.normalModalState}
          onCancel={() => this.setState({ normalModalState: false })}
          footer={null}
        >
          <Form
            key={Math.random()}
            onFinish={(v) => this.setState({ normalModalState: false })}
          >
            <Form.Item label="关键词" name={"word"}>
              <Input></Input>
            </Form.Item>
            <Form.Item>
              <Row gutter={[8, 8]}>
                <Col offset={16} span={3}>
                  <Button
                    onClick={() => this.setState({ normalModalState: false })}
                  >
                    取消
                  </Button>
                </Col>
                <Col offset={1} span={3}>
                  <Button type="primary" htmlType="submit">
                    新增
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="新增受控热搜"
          visible={this.state.controlModalState}
          onCancel={() => this.setState({ controlModalState: false })}
          footer={null}
        >
          <Form
            key={Math.random()}
            onFinish={(v) => this.setState({ controlModalState: false })}
          >
            <Form.Item label="关键词" name={"word"}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="搜索次数" name={"count"}>
              <Input type={"number"}></Input>
            </Form.Item>
            <Form.Item>
              <Row gutter={[8, 8]}>
                <Col offset={16} span={3}>
                  <Button
                    onClick={() => this.setState({ controlModalState: false })}
                  >
                    取消
                  </Button>
                </Col>
                <Col offset={1} span={3}>
                  <Button type="primary" htmlType="submit">
                    新增
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="修改热搜"
          visible={this.props.modal.show}
          onCancel={() => this.props.close_update_modal()}
          footer={null}
        >
          <Form
            key={_id}
            initialValues={{
              _id,
              word,
              count,
            }}
            onFinish={(value) => {
              //
              this.props.close_update_modal();
            }}
          >
            <Form.Item label="ID" name={"_id"}>
              <Input disabled></Input>
            </Form.Item>
            <Form.Item label="关键词" name={"word"}>
              <Input></Input>
            </Form.Item>
            <Form.Item label="搜索次数" name={"count"}>
              <Input type={"number"}></Input>
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
                  defaultValue={totalSortSelectionState.DESC}
                  style={{ width: "100%" }}
                >
                  <Option key={totalSortSelectionState.DESC}>次数降序</Option>
                  <Option key={totalSortSelectionState.ASC}>次数升序</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Button type="primary">查询</Button>
                &nbsp;
                <Button>重置</Button>
              </Col>
              <Col span={6}>
                <Button
                  onClick={() => this.setState({ normalModalState: true })}
                >
                  新增普通热搜 +{" "}
                </Button>
              </Col>
            </Row>
          </Paragraph>
          <Paragraph>
            <Table
              columns={this.columns}
              dataSource={[
                {
                  _id: "62cc265cd7f341c9ded617ce",
                  word: "龙骧",
                  count: 11,
                },
              ]}
            ></Table>
          </Paragraph>
          <Divider></Divider>
          <Paragraph>
            <Row>
              <Col span={8}>
                {this.state.controlWordSortState ? (
                  <Button
                    type="primary"
                    onClick={() =>
                      this.setState({ controlWordSortState: false })
                    }
                  >
                    保存排序
                  </Button>
                ) : (
                  <Button type="primary" disabled>
                    保存排序
                  </Button>
                )}
                &nbsp;
                <Button
                  onClick={() => this.setState({ controlModalState: true })}
                >
                  新增受控热搜 +{" "}
                </Button>
              </Col>
              <Col span={12}>
                <Alert
                  type="warning"
                  message="在您按下保存排序之前，您的拖拽排序不会被保存"
                ></Alert>
              </Col>
            </Row>
          </Paragraph>
          <Paragraph>
            <Table
              pagination={false}
              dataSource={this.state.dataSource}
              columns={columns}
              rowKey="index"
              components={{
                body: {
                  wrapper: this.DraggableContainer,
                  row: this.DraggableBodyRow,
                },
              }}
            />
          </Paragraph>
        </Typography>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.hotSearchState,
    isFetching: state.globalState.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    close_update_modal: bindActionCreators(close_update_modal, dispatch),
    delete_single_hot_search: bindActionCreators(
      delete_single_hot_search,
      dispatch
    ),
    get_background_hot_search_show_array: bindActionCreators(
      get_background_hot_search_show_array,
      dispatch
    ),
    open_update_modal: bindActionCreators(open_update_modal, dispatch),
    update_single_hot_search: bindActionCreators(
      update_single_hot_search,
      dispatch
    ),
    set_background_hot_search_pagination: bindActionCreators(
      set_background_hot_search_pagination,
      dispatch
    ),
    set_background_hot_search_query: bindActionCreators(
      set_background_hot_search_query,
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HotSearch);
