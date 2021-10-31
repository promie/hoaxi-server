import transporter from '../config/emailTransporter'

const sendAccountActivation = async (email: string, token: string) => {
  await transporter.sendMail({
    from: 'My app <info@my-app.com>',
    to: email,
    subject: 'Account Activation',
    html: `Token is ${token}`,
  })
}

export default { sendAccountActivation }
