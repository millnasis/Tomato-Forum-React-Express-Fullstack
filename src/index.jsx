import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.less";
import "./css/main.scss";

import { Provider } from "react-redux";
import store from "./reducers/reducerToStore";
import App from "./app";

class Home extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App></App>
      </Provider>
    );
  }
}

ReactDOM.render(<Home></Home>, document.querySelector("#root"));
