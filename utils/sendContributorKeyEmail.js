import SendEmail from "./SendEmail.js";

const sendContributorKeyEmail = async ({ name, email, contributerKey }) => {
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50; margin-bottom: 20px;">Congratulations! 🎉</h2>
      <p style="color: #34495e; line-height: 1.6;">
        Dear ${name},
      </p>
      <p style="color: #34495e; line-height: 1.6;">
        Your request to become a contributor at Sukoon Sphere has been approved! We're excited to have you join our community of mental health content creators.
      </p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="color: #2c3e50; font-weight: bold; margin-bottom: 10px;">Your Contributor Key:</p>
        <div style="display: flex; align-items: center; gap: 10px;">
          <code style="background-color: #fff; padding: 8px 12px; border: 1px solid #e1e4e8; border-radius: 4px; font-size: 16px; color: #3498db; font-family: monospace;">${contributerKey}</code>
          <button onclick="navigator.clipboard.writeText('${contributerKey}')" style="background-color: #3498db; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 14px;">Copy Key</button>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 8px;">Click the button to copy your key or manually select and copy the code</p>
      </div>
      <p style="color: #34495e; line-height: 1.6;">
        To start contributing:
        <ol style="color: #34495e; line-height: 1.6;">
          <li>Log in to your account</li>
          <li>Navigate to your profile</li>
          <li>Enter your contributor key when prompted</li>
        </ol>
      </p>
      <p style="color: #34495e; line-height: 1.6;">
        Thank you for being part of our mission to support mental health awareness and education.
      </p>
      <p style="color: #34495e; line-height: 1.6;">
        Best regards,<br>
        The Sukoon Sphere Team
      </p>
    </div>
  `;

  return SendEmail({
    to: email,
    subject: "Welcome to Sukoon Sphere Contributors!",
    html: message,
  });
};

export default sendContributorKeyEmail;
