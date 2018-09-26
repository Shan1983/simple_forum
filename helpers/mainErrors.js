const errors = {
  accountExists: [
    "This account already exists, please try logging in instead.",
    400
  ],
  accountNotExists: ["You need to create an account to continue.", 400],
  categoryExists: ["This category already exists.", 400],
  categoryError: ["This category does not exist.", 400],
  invalidLike: ["You cannot like your own thread/post.", 400],
  lockedError: ["This thread is locked, posting is not allowed.", 400],
  loginError: ["The username or password provided was incorrect.", 401],
  loginError: ["The username or password provided was incorrect.", 401],
  notAuthenticated: ["You are not authorized to continue.", 401],
  passwordsAreTheSame: ["You cannot use your old password.", 400],
  postRemoved: ["This post has been removed, replying is not allowed.", 400],
  settingError: ["There was an error with the settings options.", 400],
  unknown: ["An unknown error occured, reload and try again.", 500],

  parameterError(param, message) {
    return [`Error: ${param} is invalid. Message: ${message}.`, 400];
  }
};

const processErrors = errName => {
  let temp;
  if (typeof errors[errName] === "function") {
    temp = () => {
      const arrs = errors[errName](...arguments);
      return {
        name: errName,
        message: arrs[0],
        status: arrs[1],
        parameter: arguments[0]
      };
    };
  } else {
    const arrs = errors[errName];

    return {
      name: errName,
      message: arrs[0],
      status: arrs[1]
    };
  }

  return temp;
};

processedErrorsObj = {};

for (let errName in errors) {
  processedErrorsObj[errName] = processErrors(errName);
}

processedErrorsObj.sequelizeValidation = (sequelize, obj) => {
  return new sequelize.ValidationError(obj.error, [
    new sequelize.ValidationErrorItem(
      obj.name,
      "Validation error",
      obj.path,
      obj.value
    )
  ]);
};

module.exports = processedErrorsObj;