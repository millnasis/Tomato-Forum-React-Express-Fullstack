export default function htmlToText(content) {
  try {
    return content.search(/<img.+\/>/) !== -1
      ? content.replace(/<img.+>/g, "[图片]").replace(/<.+>/g, "")
      : content.replace(/<.+?>/g, "");
  } catch (error) {
    return "";
  }
}
