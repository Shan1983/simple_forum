const nodemailer = require("nodemailer");

module.exports = {
  /**
   * Setup the initial ports, host, and email auth
   * @returns {Object}
   */
  transporter() {
    return nodemailer.createTransport({
      host: "",
      port: "" || 465,
      secure: true,
      auth: {
        user: "xxx@xx.com",
        pass: "xxxx"
      }
    });
  },
  /**
   * Nodemailer options
   * Set the to, from, and message
   * @param {Request} req
   * @returns {Object}
   */
  options(req) {
    return (mailOptions = {
      from: `"site-name" <xx@gmail.com>`,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.message,
      html: ""
    });
  },
  /**
   * Sends the email
   * @param {Request} req
   */
  send(req) {
    this.transporter()
      .sendMail(options(req))
      .then(response => console.log(response))
      .catch(err => console.log(err));
  }
};
