/**
 * A list of general errors and their messages/status
 */
const errors = {
  accountExists: [
    "This account already exists, please try logging in instead.",
    400
  ],
  accountNotExists: ["You need to create an account to continue.", 400],
  banError: ["You cannot ban this user.", 400],
  categoryExists: ["This category already exists.", 400],
  categoryError: ["This category does not exist.", 400],
  invalidLike: ["You cannot like your own thread/post.", 400],
  invalidRegister: ["You need to supply all required fields.", 400],
  lockedError: ["This thread is locked, posting is not allowed.", 400],
  loginError: ["The username or password provided was incorrect.", 401],
  notAuthorized: ["You are not authorized to continue.", 401],
  noUsers: ["Currently there are no users.", 400],
  passwordsAreTheSame: ["You cannot use your old password.", 400],
  postRemoved: ["This post has been removed, replying is not allowed.", 400],
  settingError: ["There was an error with the settings options.", 400],
  unknown: [
    "Whoops! something on our end screwed up :( reload and try again.",
    500
  ],
  userNotExist: ["Sorry this user does not exist.", 400],
  verifyAccountError: [
    "Please check your registered email and follow the link to verify your account.",
    400
  ],

  /**
   * If none of the above errors are a good fit,
   * use this to generate a custom error
   * @param {String} param
   * @param {String} message
   * @returns {Array}
   */
  parameterError(param, message) {
    return [`Error: ${param} is invalid. Message: ${message}.`, 400];
  }
};
/**
 * processes the above errors, and returns the
 * appropriate error response
 * @param {String} errName
 * @returns {Object}
 */
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

/**
 * Add any errors and their values to the prrocessErrorsObj
 */
for (let errName in errors) {
  processedErrorsObj[errName] = processErrors(errName);
}
/**
 * Send the errors to sequelize, so that sequelize can throw,
 * Validation errors
 * @param {Object} sequelize
 * @param {Object} obj
 */
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
