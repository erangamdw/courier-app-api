import nodemailer, { SendMailOptions } from "nodemailer";
import mailGen from "mailgen";
import dotenv from "dotenv";
import { Express } from "../global";

dotenv.config();

const nodeConfig = {
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.FROMEMAIL,
    pass: process.env.PASSWORD,
  },
};

let transporter = nodemailer.createTransport(nodeConfig);
let mailGenerator = new mailGen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "http://mailgen.js",
  },
});

export const mailService = async ({
  userName,
  userEmail,
  subject,
  text,
}: Express.EmailCons) => {
  try {
    const email = {
      body: {
        name: userName,
        intro:
          text === "regText"
            ? `${userName}  WELLCOME TO DELIVERY COURIER SERIVCE`
            : ` WELLCOME TO DELIVERY COURIER SERIVCE `,
        outro: text === "regText" ? "Dont Reply to this email" : `${text}  `,
      },
    };

    const emailBody = mailGenerator.generate(email);

    let message: SendMailOptions = {
      from: process.env.FROMEMAIL,
      to: userEmail.toString(),
      subject:
        subject === "register"
          ? " WELLCOME TO DELIVERY COURIER SERIVCE"
          : " OTP CODE ",
      html: emailBody,
    };

    await transporter
      .sendMail(message)
      .then(() => {
        console.log("Email was sent successfully");
      })
      .catch((err) => {
        console.log("Email was not set", err);
      });
  } catch (error) {}
};
