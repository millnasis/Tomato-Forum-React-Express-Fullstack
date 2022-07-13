export default function recommendPostmlHandle(content) {
  try {
    let extra = null;
    if (content.search(/<img.+\/>/) !== -1) {
      extra = content.match(/<img.+?\/>/)[0];
      content = content.replace(/<img.+>/g, "[图片]");
    }
    if (content.search(/<video.+\/>/) !== -1) {
      extra = content.match(/<video.+?\/>/)[0];
      content = content.replace(/<video.+>/g, "[视频]");
    }
    content = content.replace(/<.+?>/g, "");
    if (extra) {
      content += extra;
    }

    return content;
  } catch (error) {
    return "";
  }
}
