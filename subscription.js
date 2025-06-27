const nodemailer = require("nodemailer");
const axios = require("axios");
const Subscriber = require("./models/subscriber");
require("dotenv").config();

// Replace these with your actual Gmail credentials
// const EMAIL_USER = "zohaib751534@gmail.com";
// const EMAIL_PASS = "rbwtzhqfkonwbzwv";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.sendWelcomeEmail = (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to News_Lens!",
    html: ` <html>
                                    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; margin: 0; padding: 0;">
                                            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background: linear-gradient(to bottom, #ffffff, #f8f9fa);">
                                                    <div style="text-align: center; margin-bottom: 30px;">
                                                            <h1 style="color: #c41e3a; font-size: 42px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">News_Lens</h1>
                                                    </div>
                                                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                                            <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Welcome to Your Daily News Source</h2>
                                                            <p style="font-size: 16px; line-height: 1.6; color: #555;">Thank you for subscribing to News_Lens! We're excited to keep you informed with our daily news updates.</p>
                                                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
                                                                    <p style="font-size: 14px;">Stay connected with the latest news and updates</p>
                                                            </div>
                                                    </div>
                                            </div>
                                    </body>
                        </html>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending welcome email:", err);
    } else {
      console.log("Welcome email sent:", info.response);
    }
  });
};

const fetchNews = async () => {
  let url = `https://newsapi.org/v2/top-headlines?category=general&language=en&apiKey=${process.env.API_KEY}`;
  const response = await axios.get(url);
  return response.data.articles.slice(0, 5);
};

module.exports.sendDailyNews = async () => {
  const news = await fetchNews();
  const newsHtml = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #c41e3a; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">News_Lens Daily Update</h1>
        </div>
        <div style="padding: 20px;">
            <p style="color: #666; font-size: 16px;">Here are today's top stories:</p>
            ${news
              .map(
                (article) => `
                <div style="margin-bottom: 30px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    ${
                      article.urlToImage
                        ? `<img src="${article.urlToImage}" alt="${article.title}" style="width: 100%; height: 250px; object-fit: cover;">`
                        : ""
                    }
                    <div style="padding: 20px;">
                        <h2 style="color: #333; font-size: 20px; margin: 0 0 10px 0;">${
                          article.title
                        }</h2>
                        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">${
                          article.description || ""
                        }</p>
                        <a href="${
                          article.url
                        }" style="background: #c41e3a; color: white; text-decoration: none; padding: 8px 15px; border-radius: 4px; display: inline-block; font-size: 14px;">Read Full Story</a>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} News_Lens. All rights reserved.</p>
            <p>You're receiving this email because you subscribed to News_Lens daily updates.</p>
        </div>
    </div>
`;

  // Fetch all subscribers from MongoDB
  const subscribers = await Subscriber.find();

  subscribers.forEach((subscriber) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: subscriber.email,
      subject: "Daily News Update",
      html: newsHtml,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending daily news email:", err);
      } else {
        console.log(
          "Daily news email sent to",
          subscriber.email,
          info.response
        );
      }
    });
  });
};
