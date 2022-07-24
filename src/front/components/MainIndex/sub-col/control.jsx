import React from "react";
import { Button } from "antd";
import { DiffOutlined } from "@ant-design/icons";

class Control extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className}>
        <Button
          type="primary"
          shape="default"
          icon={<DiffOutlined />}
          size="large"
          style={{ width: this.props.main ? "60%" : "unset" }}
          onClick={() => {
            this.props.isUserLogin
              ? this.props.show_edit_board()
              : this.props.show_login_modal();
          }}
        >
          发新帖
        </Button>
      </div>
    );
  }
}

export default Control;
