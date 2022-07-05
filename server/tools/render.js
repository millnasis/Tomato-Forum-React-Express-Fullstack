const fs = require("fs");
const { promisify } = require("util");
const path = require("path")

const readFile = promisify(fs.readFile);
const viewPath = path.resolve(__dirname,"../views")

module.exports = async (htmlName) => {
  try {
    let file = await readFile(path.resolve(viewPath,htmlName), "utf8");
    return file;
  } catch (error) {
      console.log(error);
  }
};
