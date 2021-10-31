import { UserRepository } from '../repositories'
import { IUser } from '../types/user'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
const nodemailerStub = require('nodemailer-stub')

const generateToken = (length: number): string => {
  return crypto.randomBytes(length).toString('hex').substring(0, length)
}

const signUp = async (userDetails: IUser) => {
  const { username, email, password } = userDetails

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = {
    username,
    email,
    password: hashedPassword,
    activationToken: generateToken(16),
  }

  const newUser = await UserRepository.signUp(user)

  const transporter = nodemailer.createTransport(nodemailerStub.stubTransport)

  await transporter.sendMail({
    from: 'My app <info@my-app.com>',
    to: email,
    subject: 'Account Activation',
    html: `Token is ${user.activationToken}`,
  })

  return newUser
}

const findByEmail = (email: string) => {
  return UserRepository.findByEmail(email)
}

export default {
  signUp,
  findByEmail,
}
