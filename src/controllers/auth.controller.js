const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs')

async function getRegisterController(req, res) {
  res.render("register");
}
async function postRegisterController(req, res) {
  const { username, email, password } = req.body;
  const isUserExists = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (isUserExists) {
    return res.status(400).json({
      message: "User Already exists with this this username and Email",
    });
  }
  const hashPassword = await bcrypt.hash(password,10)

  const user = await userModel.create({
    username:username,
    email:email,
    password:hashPassword
  })
  return res.status(201).json({
    message:"user register Successfully",
    user
  })
}

module.exports = {
  getRegisterController,
  postRegisterController,
};
