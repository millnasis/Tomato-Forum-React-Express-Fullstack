import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Layout, Spin, message } from "antd";
import PageHeader from "./components/PageHeader";
const { Content, Footer } = Layout;

import MainIndex from "./components/MainIndex/index";
import PostContent from "./components/PostContent/index";
import UserInfo from "./components/UserInfo/index";
import Login from "./components/Login";
import UserMessage from "./components/UserMessage";
import Search from "./components/Search";

import { actions as UIactions } from "./reducers/ui";
import { actions } from "./reducers/root";
const { show_login_modal, close_login_modal } = UIactions;
const { send_update_user_info, clear_message } = actions;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.spawnMessage = this.spawnMessage.bind(this);
  }

  componentDidMount() {
    this.props.send_update_user_info();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reload !== this.props.reload && this.props.reload) {
      window.location.reload();
    }
    if (
      prevProps.message.type !== this.props.message.type &&
      this.props.message.type !== -1
    ) {
      this.spawnMessage();
    }
  }

  spawnMessage() {
    if (this.props.message.type === 1) {
      message.success(this.props.message.content);
    } else if (this.props.message.type === 2) {
      message.error(this.props.message.content);
    } else if (this.props.message.type === 3) {
      message.warning(this.props.message.content);
    }
    this.props.clear_message();
    return false;
  }

  render() {
    return (
      <Router>
        {this.props.isFetching && (
          <div
            style={{
              position: "fixed",
              left: "0",
              top: "0",
              width: "100vw",
              height: "100vh",
              zIndex: "1000",
              background: "rgba(255,255,255,.45)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin size="large"></Spin>
          </div>
        )}
        <Login></Login>
        <Layout>
          <PageHeader
            show_login_modal={this.props.show_login_modal}
          ></PageHeader>
          <Content className="main-content">
            <div>
              <Routes>
                <Route path="/" element={<MainIndex></MainIndex>}></Route>
                <Route
                  path="/user/:userid"
                  element={<UserInfo></UserInfo>}
                ></Route>
                <Route
                  path="/post/:postid"
                  element={<PostContent></PostContent>}
                ></Route>
                <Route
                  path="/message"
                  element={<UserMessage></UserMessage>}
                ></Route>
                <Route path="/search" element={<Search></Search>}></Route>
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.globalState,
    ...state.UIState,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    show_login_modal: bindActionCreators(show_login_modal, dispatch),
    close_login_modal: bindActionCreators(close_login_modal, dispatch),
    send_update_user_info: bindActionCreators(send_update_user_info, dispatch),
    clear_message: bindActionCreators(clear_message, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
