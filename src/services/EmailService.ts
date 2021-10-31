import nodemailer from 'nodemailer'
const nodemailerStub = require('nodemailer-stub')

const transporter = nodemailer.createTransport(nodemailerStub.stubTransport)

const sendAccountActivation = async (email: string, token: string) => {
  await transporter.sendMail({
    from: 'My app <info@my-app.com>',
    to: email,
    subject: 'Account Activation',
    html: `Token is ${token}`,
  })
}

export default { sendAccountActivation }
