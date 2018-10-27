const nodeMailer = require("nodemailer");
const Email = require("email-templates");

const sender = (email, data) => {
  return email
    .send({
      template: data.template,
      message: {
        to: data.to
      },
      locals: {
        name: data.name,
        token: data.token,
        siteName: process.env.SITE_NAME
      }
    })
    .then(console.log("sent"))
    .catch(err => console.error(err));
};

exports.sendEmail = async data => {
  const transport = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const email = new Email({
    message: {
      from: `Crazy Dynamic <team@${process.env.SITE_NAME.replace(
        /\s/g,
        ""
      )}.com>`
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transport
  });

  switch (data.template) {
    case "registered":
      sender(email, data);
      break;
    case "password":
      sender(email, data);
      break;
    case "email":
      sender(email, data);
      break;
    case "profile":
      sender(email, data);
      break;
    case "account_close":
      sender(email, data);
      break;

    default: {
      return;
    }
  }
};
