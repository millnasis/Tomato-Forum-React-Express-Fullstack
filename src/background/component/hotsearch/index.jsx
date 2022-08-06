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
  delete_single_normal_hot_search,
  get_background_hot_search_show_normal_array,
  get_background_hot_search_show_control_array,
  set_background_hot_search_pagination,
  set_background_hot_search_query,
  update_single_normal_hot_search,
  change_control_array_rank,
  close_update_modal,
  open_update_modal,
  add_single_normal_hot_search,
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

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

class HotSearch extends React.Component {
  constructor(props) {
    super(props);

    this.normalColumns = [
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
              onClick={() => this.props.open_update_modal(v)}
            >
              修改
            </Button>
            <Popconfirm
              title="确定要删除吗"
              okText="确定"
              cancelText="取消"
              onConfirm={() =>
                this.props.delete_single_normal_hot_search(
                  v,
                  this.props.query,
                  this.props.pagination
                )
              }
            >
              <Button>删除</Button>
            </Popconfirm>
          </>
        ),
      },
    ];
    this.controlColumns = [
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

    this.state = {
      normalModalState: false,
      controlModalState: false,
    };
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        this.props.showControlArray.slice(),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      this.props.change_control_array_rank(newData);
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
    const index = this.props.showControlArray.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };

  componentDidMount() {
    this.props.get_background_hot_search_show_normal_array();
    this.props.get_background_hot_search_show_control_array();
  }

  render() {
    console.log(this.props);
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
            onFinish={(v) => {
              const { word, count } = v;
              if (!word || !count) {
                return;
              }
              this.props.add_single_normal_hot_search(
                v,
                this.props.query,
                this.props.pagination
              );
              this.setState({ normalModalState: false });
            }}
          >
            <Form.Item label="关键词" name={"word"} required>
              <Input></Input>
            </Form.Item>
            <Form.Item label="搜索次数" name={"count"} required>
              <Input type={"number"}></Input>
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
            <Form.Item label="关键词" name={"word"} required>
              <Input></Input>
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
              this.props.update_single_normal_hot_search(
                value._id,
                value,
                this.props.query,
                this.props.pagination
              );
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
              columns={this.normalColumns}
              dataSource={this.props.showNormalArray}
              loading={this.props.isFetching}
              pagination={this.props.pagination}
              onChange={(pagination) => {
                this.props.get_background_hot_search_show_normal_array(
                  pagination,
                  this.props.query
                );
              }}
            ></Table>
          </Paragraph>
          <Divider></Divider>
          <Paragraph>
            <Row>
              <Col span={8}>
                {this.props.controlWordSortState ? (
                  <Button
                    type="primary"
                    onClick={
                      () => null
                      // this.setState({ controlWordSortState: false })
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
              dataSource={this.props.showControlArray}
              columns={this.controlColumns}
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
    delete_single_normal_hot_search: bindActionCreators(
      delete_single_normal_hot_search,
      dispatch
    ),
    get_background_hot_search_show_normal_array: bindActionCreators(
      get_background_hot_search_show_normal_array,
      dispatch
    ),
    open_update_modal: bindActionCreators(open_update_modal, dispatch),
    update_single_normal_hot_search: bindActionCreators(
      update_single_normal_hot_search,
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
    get_background_hot_search_show_control_array: bindActionCreators(
      get_background_hot_search_show_control_array,
      dispatch
    ),
    change_control_array_rank: bindActionCreators(
      change_control_array_rank,
      dispatch
    ),
    add_single_normal_hot_search: bindActionCreators(
      add_single_normal_hot_search,
      dispatch
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HotSearch);
