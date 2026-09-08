const transporter = require("./email");

const sendResetPasswordEmail = async (user) => {
    if (process.env.NODE_ENV === "test") return;

    const resetUrl =
        `${process.env.FRONTEND_URL}/reset-password/${user.passwordResetToken}`;

    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: user.email,

        subject: "Reset your password",

        html: `
            <h2>Password Reset</h2>

            <p>Hello ${user.name}</p>

            <p>Click below to reset your password.</p>

            <a href="${resetUrl}">
                Reset Password
            </a>

            <p>This link expires in 1 hour.</p>
        `
    });

};

module.exports = sendResetPasswordEmail;