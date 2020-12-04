import passport from 'passport'
import { All, Authenticated, Controller, Get, Post } from './Controller'
import { Request, Response } from 'express'
import User, { IUser } from '../models/User'
import bcrypt from 'bcrypt'
import { clean } from '../util/utils'
export class Auth extends Controller {
    private authenticator: passport.Authenticator

    /**
     *Creates an instance of Auth Controller
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {string} path
     * @param {passport.Authenticator} authenticator
     * @memberof Auth
     */
    constructor(path: string, authenticator: passport.Authenticator) {
        super(path)
        this.authenticator = authenticator
    }

    /**
     * @description POST /api/auth/register route handler
     * @author Alex Chomiak
     * @date 2020-11-23
     * @private
     * @param {Request} req
     * @param {Response} res
     * @memberof Auth
     */
    @Post('/register')
    async registerUser(req: Request, res: Response) {
        const { firstName, lastName, email, password } = req.body

        if (!email || !password || !firstName || !lastName) {
            this.clientError(
                res,
                'Registration error, did you provide an email and correctly formatted credentials?'
            )
            return
        }

        if (!(await User.findOne({ email }))) {
            const user = await new User({
                email,
                password: await bcrypt.hash(password, 9),
                firstName,
                lastName,
            }).save()
            req.logIn(user, () => this.ok<IUser>(res, clean(user)))
        } else {
            this.clientError(res, 'User already exists with the given credentials.')
        }
    }

    /**
     * @description POST /api/auth/login route handler
     * @author Alex Chomiak
     * @date 2020-11-23
     * @private
     * @param {Request} req
     * @param {Response} res
     * @memberof Auth
     */
    @Post('/login')
    loginUser(req: Request, res: Response) {
        const { email, password } = req.body
        if (!email || !password) {
            this.clientError(
                res,
                'Authentication error, did you provide an email and correctly formatted credentials?'
            )
            return
        }

        this.authenticator.authenticate('local', user => {
            if (!user) this.clientError(res, 'Authentication error. Is this the correct email?')
            else req.logIn(user, () => this.ok<IUser>(res, clean(user)))
        })(req, res)
    }

    /**
     * @description ALL /api/auth/logout route handler
     * @author Alex Chomiak
     * @date 2020-11-23
     * @private
     * @param {Request} req
     * @param {Response} res
     * @memberof Auth
     */
    @All('/logout')
    @Authenticated()
    logout(req: Request, res: Response) {
        req.logout()
        this.ok<string>(res, 'ok')
    }

    /**
     * @description GET /api/auth/user route handler
     * @author Alex Chomiak
     * @date 2020-11-23
     * @private
     * @param {Request} req
     * @param {Response} res
     * @memberof Auth
     */
    @Get('/user')
    @Authenticated()
    async getUser(req: Request, res: Response) {
        this.ok<IUser>(res, clean(await User.findOne({ _id: (req.user as IUser)._id })))
    }
}
