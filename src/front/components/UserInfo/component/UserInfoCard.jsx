import React from "react";
import {
  Card,
  Descriptions,
  Avatar,
  Button,
  Modal,
  Form,
  Radio,
  Input,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import formatTime from "../../../tools/LocalDate.js";

class UserInfoCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: [],
    };

    this.uploadRef = React.createRef();

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.showUserInfo.head_picture !==
      prevProps.showUserInfo.head_picture
    ) {
      this.setState({
        avatar: [{ status: "done", url: this.props.showUserInfo.head_picture }],
      });
    }
  }

  handleSubmit(data) {
    const { id } = this.props.showUserInfo;
    const { sex, email, words, age } = data;
    let head_picture = null;
    if (this.state.avatar.length === 0) {
      head_picture = "/public/default-avatar.png";
    } else if ("url" in this.state.avatar[0]) {
      head_picture = this.state.avatar[0].url;
    } else if ("response" in this.state.avatar[0]) {
      head_picture = this.state.avatar[0].response;
    }
    const userInfo = {
      sex,
      email,
      words,
      head_picture,
      age,
    };
    this.props.update_user_info(id, userInfo);
  }

  handleCancel() {
    this.props.close_editor();
  }

  render() {
    console.log(this.props);
    const { username, words, sex, age, foundtime, head_picture, email, id } =
      this.props.showUserInfo;
    return (
      <Card>
        <div className="user-info-card">
          <Avatar
            size={"large"}
            shape="square"
            src={head_picture}
            style={{
              width: "150px",
              height: "150px",
              marginRight: "30px",
              marginBottom: "20px",
            }}
          ></Avatar>
          <Descriptions title={username} style={{ flex: "1" }}>
            <Descriptions.Item label="个性签名">{words}</Descriptions.Item>
            <Descriptions.Item label="邮箱地址">
              {email ? email : "无"}
            </Descriptions.Item>
            <Descriptions.Item label="年龄">{age}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {formatTime(foundtime)}
            </Descriptions.Item>
            <Descriptions.Item label="性别">{sex}</Descriptions.Item>
          </Descriptions>
          {this.props.isMe ? (
            <Button
              type="primary"
              onClick={() => {
                this.props.open_editor();
              }}
            >
              修改个人资料
            </Button>
          ) : !this.props.isFollow ? (
            <Button
              type="primary"
              onClick={() => {
                if (!this.props.isUserLogin) {
                  this.props.show_login_modal();
                  return;
                }
                this.props.send_follow(id);
              }}
            >
              关注
            </Button>
          ) : (
            <Button
              type="ghost"
              style={{ color: "gray" }}
              onClick={() => {
                this.props.send_unfollow(id);
              }}
            >
              已关注
            </Button>
          )}
          <Modal
            title="修改个人资料"
            visible={this.props.isShowEditor}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Form
              onFinish={this.handleSubmit}
              initialValues={{ sex: sex, words: words, email: email, age: age }}
            >
              <Form.Item label="修改头像">
                <ImgCrop rotate>
                  <Upload
                    action="/api/upload/avatar"
                    listType="picture-card"
                    fileList={this.state.avatar}
                    name="avatar"
                    onChange={(e) => {
                      this.setState({ avatar: e.fileList });
                    }}
                    maxCount={1}
                  >
                    + 上传新头像
                  </Upload>
                </ImgCrop>
              </Form.Item>
              <Form.Item
                label="性别"
                name={"sex"}
                style={{ display: "inline-block", width: "calc(50% - 12px)" }}
              >
                <Radio.Group>
                  <Radio value={"男"}>男</Radio>
                  <Radio value={"女"}>女</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="年龄"
                name={"age"}
                style={{ display: "inline-block", width: "calc(50% - 12px)" }}
              >
                <Input type={"number"}></Input>
              </Form.Item>
              <Form.Item label="个性签名" name={"words"}>
                <Input type={"text"} maxLength={30} />
              </Form.Item>
              <Form.Item label="邮箱地址" name={"email"}>
                <Input type={"email"} />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 15, span: 20 }}>
                <Button
                  style={{ marginRight: "10px" }}
                  onClick={this.handleCancel}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={this.props.isEditorFetching}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Card>
    );
  }
}

export default UserInfoCard;
