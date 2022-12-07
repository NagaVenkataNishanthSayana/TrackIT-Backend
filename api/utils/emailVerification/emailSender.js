import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv/config';

//Function to Send Email
const sendEmail = (senderEmail, otp) => {
    console.log(process.env.TEST_EMAIL);
    var mailOptions = {

        from: process.env.USER_EMAIL,
        to: senderEmail,
        subject: 'Email Verification for TrackIT',
        html: `<h2>Welcome to TrackIt!</h2><p>Thanks for signing up at TrackIt. Your OTP is <b>${otp}</b>, it will expire in 2 minutes.<br></p><h3>See you soon!</h3>`
    };

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: true,
        tls: {
            rejectUnauthorized: true,
            minVersion: "TLSv1.2"
        },
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        }
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email not sent due to the error: ", error);
        }
    });
}


export default sendEmail;