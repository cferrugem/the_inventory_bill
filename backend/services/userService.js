const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  getAllUsers: async () => {
    return await userModel.getAllUsers();
  },

  getUserById: async (id) => {
    return await userModel.getUserById(id);
  },

  createUser: async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(
      `Creating user ${username} with hashed password: ${hashedPassword}`
    ); // Debugging
    return await userModel.createUser(username, hashedPassword);
  },

  updateUser: async (id, data) => {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await userModel.updateUser(id, data);
  },

  deleteUser: async (id) => {
    return await userModel.deleteUser(id);
  },

  login: async (username, password) => {
    const user = await userModel.getUserByUsername(username);
    if (!user) {
      console.log("User not found"); // Debugging
      throw new Error("User not found");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("Password mismatch"); // Debugging
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    console.log("Generated token:", token); // Debugging

    return token;
  },
};
