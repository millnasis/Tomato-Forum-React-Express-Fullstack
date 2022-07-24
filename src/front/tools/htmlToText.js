export default function htmlToText(content) {
  try {
    if (content.search(/<img.+\/>/) !== -1) {
      content = content.replace(/<img.+>/g, "[图片]")
    }
    if (content.search(/<video.+\/>/) !== -1) {
      content = content.replace(/<video.+>/g, "[视频]")
    }
    return content.replace(/<.+?>/g, "");
  } catch (error) {
    return "";
  }
}
