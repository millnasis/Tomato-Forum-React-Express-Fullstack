/**
 *
 * @param {String} name 模块名
 * @param {String} content 显示内容
 * @param {Boolean} table 是显示表格
 */
export function consoleDebugTool(name, content, table = false) {
  console.log("%c控制台调试", "background:black;font-size:24px;color:pink");
  console.log(
    `%c模块${name}显示调试信息如下：`,
    "background:black;color:pink;font-size:16px"
  );
  if (table) {
    console.table(content);
  } else {
    console.log(content);
  }
  console.log(
    `%c******结束******`,
    "background:black;color:pink;font-size:16px"
  );
}
