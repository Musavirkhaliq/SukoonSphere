import SendEmail from "./SendEmail.js";

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetEmail = `https://sukoonsphere.org/user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link :<a href="${resetEmail}">reset password</a></p>`;
  return SendEmail({
    to: email,
    subject: "Reset Password",
    html: `Hello ${name}, ${message}`,
  });
};
export default sendResetPasswordEmail;
