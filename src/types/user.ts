export interface IUser {
  username: string
  email: string
  password: string
  inactive?: boolean
  activationToken?: string
}
