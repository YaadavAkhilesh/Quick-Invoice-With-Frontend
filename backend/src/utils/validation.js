const validateUsername = (username) => {
  return !username.includes(" ");
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateGSTNumber = (gstNo) => {
  return gstNo.length === 15;
};

module.exports = {
  validateUsername,
  validatePassword,
  validateGSTNumber,
};