const nodemailer = require(nodemailer);

module.exports = {
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
  options(req) {
    return (mailOptions = {
      from: `"site-name" <xx@gmail.com>`,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.message,
      html: ""
    });
  },

  send(req) {
    this.transporter()
      .sendMail(options(req))
      .then(response => console.log(response))
      .catch(err => console.log(err));
  }
};
