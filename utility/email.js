const nodemailer = require('nodemailer');
const sendEmail = async function (options) {
  // create transporter 
  const transprot = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  // define email optinons
  const mailOptions = {
    from: 'ajab.sharifulislam@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // send mail to uer 
  await transprot.sendMail(mailOptions);
}
module.exports = sendEmail;
