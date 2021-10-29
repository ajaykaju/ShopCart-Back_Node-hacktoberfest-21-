import sgMail from "@sendgrid/mail";
import verificationTemplateGenerator from "./templateVerification";
import welcomeTemplateGenerator from "./templateWelcome";

sgMail.setApiKey(process.env.SENDGRID_API as string);

export const sendVerificationMail = async (
  to: string,
  data: string,
  name: string,
  callback: (error: undefined | object, data: undefined | boolean) => void
) => {
  const msg: sgMail.MailDataRequired = {
    to,
    from: "ajukodinhi@gmail.com",
    subject: "ShopCart Confirmation",
    text: "ShopCart email verification",
    html: verificationTemplateGenerator(
      name,
      `http://localhost:${process.env.PORT}/verify?token=${data}`
    ),
  };

  await sgMail
    .send(msg)
    .then(() => {
      callback(undefined, true);
    })
    .catch((error) => {
      callback(error, undefined);
      console.log(error);
    });
};

export const sendWelcomMail = async (to: string, name: string) => {
  const msg: sgMail.MailDataRequired = {
    to,
    from: "ajukodinhi@gmail.com",
    subject: "ShopCart Welcome",
    text: "ShopCart Welcome Mail",
    html: welcomeTemplateGenerator(
      name,
      `${process.env.FRONT_END_URL}/login`
    ),
  };

  await sgMail.send(msg);
};
