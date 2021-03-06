import nodemailer from 'nodemailer'
import transporter from '../config/emailTransporter'

const sendAccountActivation = async (email: string, token: string) => {
  const info = await transporter.sendMail({
    from: 'My app <info@my-app.com>',
    to: email,
    subject: 'Account Activation',
    html: `
    <div>
      <b>Please click below link to activate your account</b>
    </div>
    <div>
      <a href='http://localhost:8080/#/login?token=${token}'>Activate</a>
    </div>
    `,
  })

  if(process.env.NODE_ENV === 'development') {
    console.log(`url ${nodemailer.getTestMessageUrl(info)}`)
  }
}

export default { sendAccountActivation }
