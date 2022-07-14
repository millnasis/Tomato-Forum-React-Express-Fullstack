function getRegexByKeyword(keywords) {
  let regex = "";
  for (let index = 0; index < keywords.length; index++) {
    const element = keywords[index];
    regex += element;
    if (index < keywords.length - 1) {
      regex += "|";
    }
  }
  return new RegExp(regex);
}

module.exports = getRegexByKeyword;
