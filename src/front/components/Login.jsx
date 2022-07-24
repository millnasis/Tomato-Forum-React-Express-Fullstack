import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Modal, Form, Input, Avatar, Button, Alert } from "antd";

import { actions as UIactions } from "../reducers/ui";
import { actions } from "../reducers/root";
const { show_login_modal, close_login_modal, reset_login_error } = UIactions;
const { send_login, send_register } = actions;

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRegister: false,
    };

    this.submitHandle = this.submitHandle.bind(this);
  }

  submitHandle(values) {
    if (!this.state.isRegister) {
      this.props.send_login(values.username, values.password);
    } else {
      this.props.send_register({
        username: values.username,
        password: values.password,
      });
    }
  }

  render() {
    return (
      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Avatar src="/public/default-avatar.png" size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}></Avatar>
            <h3>{this.state.isRegister ? "注册" : "登陆"}</h3>
          </div>
        }
        visible={this.props.isShowLoginModal}
        footer={null}
        onCancel={() => this.props.close_login_modal()}
      >
        <Form onFinish={this.submitHandle}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              onChange={() => {
                this.props.isLoginError !== null
                  ? this.props.reset_login_error()
                  : null;
              }}
            />
          </Form.Item>
          <Form.Item>
            {this.props.isLoginError === "username" && (
              <Alert showIcon message="用户名有误" type="error"></Alert>
            )}
            {this.props.isLoginError === "userexist" && (
              <Alert showIcon message="用户已存在" type="error"></Alert>
            )}
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              onChange={() => {
                this.props.isLoginError !== null
                  ? this.props.reset_login_error()
                  : null;
              }}
            />
          </Form.Item>
          <Form.Item>
            {this.props.isLoginError === "password" && (
              <Alert showIcon message="密码错误" type="error"></Alert>
            )}
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 20 }}>
            <a
              onClick={() =>
                this.setState({ isRegister: !this.state.isRegister })
              }
            >
              {this.state.isRegister ? "去登陆？" : "去注册？"}
            </a>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 15, span: 20 }}>
            <Button
              onClick={() => this.props.close_login_modal()}
              style={{ marginRight: "8px" }}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "8px" }}
              loading={this.props.isLoginModalFetching}
            >
              {this.state.isRegister ? "注册" : "登陆"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.UIState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    show_login_modal: bindActionCreators(show_login_modal, dispatch),
    close_login_modal: bindActionCreators(close_login_modal, dispatch),
    send_login: bindActionCreators(send_login, dispatch),
    send_register: bindActionCreators(send_register, dispatch),
    reset_login_error: bindActionCreators(reset_login_error, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
