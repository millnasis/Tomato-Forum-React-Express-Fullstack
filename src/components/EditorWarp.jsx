import React from "react";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";

class EditorWarp extends React.Component {
  constructor(props) {
    super(props);
    this.editor = null;
  }

  createEditor = (editor) => {
    this.editor = editor;
    console.log(editor.getMenuConfig("uploadImage"));
  };

  componentDidMount() {
    
  }

  componentDidUpdate(prevProp) {
    if (prevProp.focus !== this.props.focus && this.props.focus) {
      this.editor.focus();
      this.editor
        .getEditableContainer()
        .scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  componentWillUnmount() {
    if (this.editor == null) {
      return;
    }
    this.editor.destroy();
    this.editor = null;
  }

  render() {
    const { style, menus, height } = this.props;
    this.height = height ? +height + "px" : "500px";
    this.editorConfig = { MENU_CONF: {} };
    this.editorConfig.MENU_CONF["uploadImage"] = {
      server: "/api/upload/img",
      fieldName: "img",
      maxNumberOfFiles: 1,
    };
    this.toolbarConfig = Array.isArray(menus) ? { toolbarKeys: menus } : {};
    this.style = { border: "1px solid #ccc" };
    if (typeof style === "object") {
      this.style = Object.assign(this.style, style);
    }
    return (
      <div style={this.style}>
        <Toolbar
          editor={this.editor}
          defaultConfig={this.toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        ></Toolbar>
        <Editor
          defaultConfig={this.editorConfig}
          value={this.props.value}
          onCreated={this.createEditor}
          onChange={this.props.onChange}
          mode="default"
          style={{ height: this.height, overflowY: "hidden" }}
        ></Editor>
      </div>
    );
  }
}

export default EditorWarp;
