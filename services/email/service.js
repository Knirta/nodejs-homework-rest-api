const Mailgen = require("mailgen");
class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = "https://ca9c-188-163-8-56.ngrok.io";
        break;
      case "production":
        this.link = "link for production";
        break;
      default:
        this.link = "https://ca9c-188-163-8-56.ngrok.io";
        break;
    }
  }

  createTemplateEmail(verifyToken) {
    const mailGenerator = new Mailgen({
      theme: "neopolitan",
      product: {
        name: "Contacts in pocket",
        link: this.link,
      },
    });

    const email = {
      body: {
        name: "Guest",
        intro:
          "Welcome to Contacts in pocket! We're very excited to have you on board.",
        action: {
          instructions:
            "To get started with Contacts in pocket, please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    };
    return mailGenerator.generate(email);
  }

  async sendVerifyEmail(email, verifyToken) {
    const emailHTML = this.createTemplateEmail(verifyToken);
    const msg = {
      to: email,
      subject: "Verify your email",
      html: emailHTML,
    };
    try {
      const result = await this.sender.send(msg);
      console.log(result);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }
}

module.exports = EmailService;
