const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: 'https://my-portfolio-beta-two-83.vercel.app/' 
}));
app.use(express.json());

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajabhishek439@gmail.com',
    pass: process.env.PASS
  }
});

contactEmail.verify((error) => {
  if (error) {
    console.error("Error in email configuration:", error);
  } else {
    console.log("Email service is ready to send.");
  }
});

app.post("/contact", (req, res) => {
  console.log("posting");
  const { firstName, lastName, email, phone, message } = req.body;
  const name = `${firstName} ${lastName}`;
  const mail = {
    from: name,
    to: "rajabhishek439@gmail.com",
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };

  contactEmail.sendMail(mail, (error, info) => {
    if (error) {
      console.error('Email send error:', error);
      res.status(500).json({ code: 500, status: "Failed to send message" });
    } else {
      console.log('Email sent:', info.response);
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});

app.listen(5000, () => console.log("Server Running on port 5000"));
