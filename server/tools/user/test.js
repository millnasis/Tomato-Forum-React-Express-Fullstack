(async () => {
  const userDAO = require("./UserDAO");

  let fuck = new userDAO();
  let userVO = await fuck.queryByID("619c6d40188d79789b2dc318");
  userVO.changeInfo({head_picture:"fuck",words:"fuck",sex:"男",email:"123@123.com"})
  let ret = await fuck.updateUserByUserVO(userVO);

  console.log(ret);
})();
