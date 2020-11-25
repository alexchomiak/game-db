import { Request, Response, NextFunction } from 'express'
import { IUser } from '../models/User'
export type Middleware = (req: Request, res: Response, next: NextFunction) => void

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) next()
    else res.status(401).send('This route requires authentication!')
}

export const clean = (user: IUser) => {
    let obj = user.toJSON()
    console.log(user)
    delete obj.password
    // delete obj._id
    delete obj.__v
    return obj
}
