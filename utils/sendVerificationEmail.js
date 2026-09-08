const transporter = require("./email");

const sendVerificationEmail = async (user) => {
    if (process.env.NODE_ENV === "test") return;

    const verificationURL =
        `${process.env.FRONTEND_URL}/verify-email/${user.emailVerificationToken}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify Your Email",
        html: `
            <h2>Hello ${user.name}</h2>

            <p>Please verify your email address.</p>

            <a href="${verificationURL}">
                Verify Email
            </a>
        `
    });

};

module.exports = sendVerificationEmail;