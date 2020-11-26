import express from 'express'
import compression from 'compression' // compresses requests
import session from 'express-session'
import flash from 'express-flash'
import mongoose from 'mongoose'
import passport from 'passport'
import cors from 'cors'
import dotenv from 'dotenv'
import { Controller } from './controllers/Controller'
import { Server } from 'http'
import { Strategy as LocalStrategy } from 'passport-local'
import User, { IUser } from './models/User'
import bcrypt from 'bcrypt'
import { Middleware, clean } from './util/utils'
import { Auth } from './controllers/Auth'
import * as redis from 'redis'
import { Content } from './controllers/Content'
import handlebars from 'express-handlebars'
import path from 'path'
declare module 'express' {
    export interface Request {
        user?: IUser
    }
}
export default class App {
    #app: express.Application
    #basePath: string
    #serviceName: string
    #port: number

    get app(): express.Application {
        return this.#app
    }

    constructor(port: number, basePath: string, serviceName: string) {
        this.#app = express()
        this.#port = port
        this.#basePath = basePath
        this.#serviceName = serviceName
    }

    private bindMiddlewares = (middlewares?: Middleware[]) => {
        if (middlewares && middlewares.length > 0)
            middlewares.forEach(middle => this.#app.use(middle))
    }

    private bindControllers = (controllers?: Controller[]) => {
        if (controllers && controllers.length > 0)
            controllers.forEach(controller => {
                controller.bindRoutes()
                this.#app.use(this.#basePath + controller.path, controller.router)
            })
    }
    public listen = (): Server => {
        return this.#app.listen(this.#port, () => {
            console.log(`${this.#serviceName} has started.`)
        })
    }

    public async init() {
        this.#app.options('*', cors)
        const passportInstance = new passport.Authenticator()

        const middlewares = [
            flash(),
            compression(),
            express.json(),
            express.urlencoded({ extended: true })
        ]

        // * Connect to Mongo
        try {
            const redisUri = process.env.API_REDIS_URI || 'redis://localhost:6379'
            const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/boilerplate'
            mongoose.Promise = global.Promise
            await mongoose.connect(mongoUrl, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
        } catch (err) {
            console.log(err)
        }
        // * Connect to redis
        let redisClient: redis.RedisClient
        try {
            const redisUri = process.env.API_REDIS_URI || 'redis://localhost:6379'
            // * Initialize Redis Client and Redis Session Store
            redisClient = redis.createClient(redisUri)
            const RedisStore = require('connect-redis')(session)
            const SessionStore = new RedisStore({ client: redisClient, resave: false })
            SessionStore.client.unref()

            // * Setup express session
            middlewares.push(
                session({
                    resave: true,
                    saveUninitialized: true,
                    secret: process.env.SESSION_SECRET || 'This is not a secure secret!',
                    store: SessionStore,
                    cookie: { secure: process.env.NODE_ENV === 'production' }
                })
            )

            middlewares.push(passportInstance.initialize())
            middlewares.push(passportInstance.session())
        } catch (err) {
            console.log(err)
        }

        // * Bind passport strategies
        passportInstance.use(
            new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
                User.findOne({ email }).then(user => {
                    if (!user) return done(null, false)
                    else {
                        bcrypt.compare(password, user.password).then(result => {
                            if (result) return done(user, true)
                            else return done(null, false)
                        })
                    }
                })
            })
        )
        passportInstance.serializeUser((user: IUser, cb) => {
            return cb(null, user._id)
        })

        passportInstance.deserializeUser((id, cb) => {
            User.findOne({ _id: id }).then(user => {
                if (user) {
                    return cb(null, clean(user))
                } else {
                    throw new Error('User does not exist with given ID')
                }
            })
        })

        // * Setup Handlebars
        this.#app.engine('hbs', handlebars({
            layoutsDir:path.join(__dirname , 'views/layouts/'),
            defaultLayout: "index",
            extname: '.hbs'
        }))
        this.#app.set('views', path.join(__dirname , 'views'));

        this.#app.set('view engine', 'hbs')

     

        console.log()

        // * Bind middlewares
        this.bindMiddlewares(middlewares)

        // * Create controllers
        const authCtrl = new Auth('/auth', passportInstance)
        const contentCtrl = new Content('/' )
        this.bindControllers([authCtrl, contentCtrl])
    }
}
