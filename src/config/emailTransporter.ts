import nodemailer from 'nodemailer'
const nodemailerStub = require('nodemailer-stub')

const transporter = nodemailer.createTransport(nodemailerStub.stubTransport)

export default transporter
