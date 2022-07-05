import React from "react";
import { Card } from "antd";
import { LikeFilled, MenuFoldOutlined } from "@ant-design/icons";

class UserOtherRecords extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card className="user-info-sub-col-component">
        <LikeFilled style={{marginRight:"10px",fontSize:"25px",marginBottom:"10px"}}/>
         点赞数：100
         <br></br>
        <MenuFoldOutlined style={{marginRight:"10px",fontSize:"25px"}}/>
         回复数：15
      </Card>
    );
  }
}

export default UserOtherRecords;
