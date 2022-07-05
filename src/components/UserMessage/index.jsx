import React from "react";
import MessageControl from "./component/MessageControl";
import ShowMessageBody from "./component/ShowMessageBody";
import "./css/index.scss";

class UserMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="user-message-warp">
        <MessageControl position="left"></MessageControl>
        <ShowMessageBody></ShowMessageBody>
      </div>
    );
  }
}

export default UserMessage;
