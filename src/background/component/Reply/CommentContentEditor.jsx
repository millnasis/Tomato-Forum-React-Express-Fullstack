import { Button, Input } from "antd";
import axios from "axios";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions } from "../../reducers/root";
const { set_message } = actions;

class CommentContentEditor extends React.Component {
  constructor(props) {
    super(props);

    this.originID = props.id;
    this.masterID = props.masterID;
    this.state = {
      edit: false,
      value: props.value,
      originValue: props.value,
      loading: false,
    };
  }

  sendToUpadte = async (id, value, masterID) => {
    const response = await axios.post(`/api/admin/comments`, {
      masterID,
      id,
      content: value,
    });

    if (response && response.status === 200) {
      this.setState({
        loading: false,
        originValue: this.state.value,
        edit: false,
      });
    } else {
      set_message(2, "修改失败，服务端错误");
    }
  };

  render() {
    return (
      <div className="comment-content">
        {this.state.edit ? (
          this.state.loading ? (
            <Input.TextArea disabled></Input.TextArea>
          ) : (
            <Input.TextArea
              value={this.state.value}
              onChange={(e) =>
                this.setState({ value: e.nativeEvent.target.value })
              }
            ></Input.TextArea>
          )
        ) : (
          <div className="content">{this.state.value}</div>
        )}
        <div className="button">
          {this.state.edit ? (
            <div>
              <Button
                style={{ margin: "3px" }}
                onClick={() =>
                  this.setState({ edit: false, value: this.state.originValue })
                }
              >
                取消
              </Button>
              <Button
                style={{ margin: "3px" }}
                type="primary"
                onClick={() => {
                  this.sendToUpadte(
                    this.originID,
                    this.state.value,
                    this.masterID
                  );
                  this.setState({ loading: true });
                }}
                loading={this.state.loading}
              >
                保存
              </Button>
            </div>
          ) : (
            <Button onClick={() => this.setState({ edit: true })}>修改</Button>
          )}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    set_message: bindActionCreators(set_message, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(CommentContentEditor);
