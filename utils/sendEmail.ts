import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "d3sktesvkkcaq7ll@ethereal.email", // generated ethereal user
      pass: "k4XYAABxSGw376UAkk", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"admin" <foo@example.com>', // sender address
    to: to, // list of receivers
    subject: "Change password", // Subject line
    text: html, // plain text body
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
