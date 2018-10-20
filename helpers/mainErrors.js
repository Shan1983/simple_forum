/**
 * A list of general errors and their messages/status
 */
const errors = {
  accountExists: [
    "This account already exists, please try logging in instead.",
    400
  ],
  accountNotExists: ["This account does not exist.", 400],
  banError: ["You cannot ban this user.", 400],
  alreadyBanError: ["This user is already banned.", 400],
  canNotDeleteAdmin: ["You cannot delete a admin.", 400],
  categoryExists: ["This category already exists.", 400],
  categoryError: ["This category does not exist.", 400],
  categoryTitleError: ["Categories must be unique.", 400],
  emailError: ["A valid email address must be supplied.", 400],
  friendRequestError: ["That friend request does not exist.", 400],
  invalidLike: ["You cannot like your own thread/post.", 400],
  invalidRegister: ["You need to supply all required fields.", 400],
  likeError: ["This like does not exist.", 400],
  lockedError: ["This thread is locked.", 400],
  loginError: ["The username or password provided was incorrect.", 401],
  notAuthorized: ["You are not authorized to continue.", 401],
  noUsers: ["Currently there are no users.", 400],
  passwordsAreTheSame: ["You cannot use your old password.", 400],
  passwordError: ["The supplied password was incorrect.", 400],
  pollError: ["That poll does not exist.", 400],
  pollResponseError: ["A poll must have at least 2 responses.", 400],
  pollResponseDuplicates: ["A poll cannot contain any duplicates.", 400],
  pollQuestionError: ["A poll question can not be blank.", 400],
  pollAlreadyVotedError: ["You can only vote once.", 400],
  pollEndedError: ["This poll has finished.", 400],
  postRemoved: ["This post has been removed, replying is not allowed.", 400],
  postError: ["This post does not exist.", 400],
  settingError: ["There was an error with the settings options.", 400],
  sameLikeError: ["You can not like a Thread/Post more than once.", 400],
  threadError: ["This thread does not exist.", 400],
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
