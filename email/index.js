var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "yoyoradigames@gmail.com",
        pass: "ccdqoimlvrkguohe",
    },
});

var mailOptions = {
    from: "yoyoradigames@gmail.com",
};


const send = async (html, email, subject) => {
    return await transporter.sendMail({ ...mailOptions, html: html, to: [email], subject: subject });
}

// send('<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Two-Factor Authentication</title><style>body{font-family:Arial,sans-serif;background-color:#f5f5f5;padding:20px;margin:0;}.container{max-width:600px;margin:auto;background-color:#ffffff;padding:30px;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.1);}h1{color:#333333;}p{color:#666666;}.code{background-color:#f0f0f0;padding:10px;border-radius:5px;font-size:24px;margin-bottom:20px;}.footer{text-align:center;margin-top:20px;color:#999999;}</style></head><body><div class="container"><h1>Two-Factor Authentication</h1><p>Dear User,</p><p>Your authentication code is:</p><div class="code">123456</div><p>Please enter this code in the appropriate field to complete the authentication process.</p><p>If you did not request this code, please ignore this email.</p><p>Thank you,</p><p>Your Company</p><div class="footer">This is an automated email, please do not reply.</div></div></body></html>', "yoyoradigames@gmail.com", "code");


module.exports = { send: send };