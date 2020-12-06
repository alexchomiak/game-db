"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _app, _basePath, _serviceName, _port;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression")); // compresses requests
const express_session_1 = __importDefault(require("express-session"));
const express_flash_1 = __importDefault(require("express-flash"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const passport_local_1 = require("passport-local");
const User_1 = __importDefault(require("./models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("./util/utils");
const Auth_1 = require("./controllers/Auth");
const redis = __importStar(require("redis"));
const Postgres_1 = require("./controllers/Postgres");
const pg_1 = __importDefault(require("pg"));
class App {
    constructor(port, basePath, serviceName) {
        _app.set(this, void 0);
        _basePath.set(this, void 0);
        _serviceName.set(this, void 0);
        _port.set(this, void 0);
        this.bindMiddlewares = (middlewares) => {
            if (middlewares && middlewares.length > 0)
                middlewares.forEach(middle => __classPrivateFieldGet(this, _app).use(middle));
        };
        this.bindControllers = (controllers) => {
            if (controllers && controllers.length > 0)
                controllers.forEach(controller => {
                    controller.bindRoutes();
                    __classPrivateFieldGet(this, _app).use(__classPrivateFieldGet(this, _basePath) + controller.path, controller.router);
                });
        };
        this.listen = () => {
            return __classPrivateFieldGet(this, _app).listen(__classPrivateFieldGet(this, _port), () => {
                console.log(`${__classPrivateFieldGet(this, _serviceName)} has started.`);
            });
        };
        __classPrivateFieldSet(this, _app, express_1.default());
        __classPrivateFieldSet(this, _port, port);
        __classPrivateFieldSet(this, _basePath, basePath);
        __classPrivateFieldSet(this, _serviceName, serviceName);
    }
    get app() {
        return __classPrivateFieldGet(this, _app);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _app).options('*', cors_1.default);
            const passportInstance = new passport_1.default.Authenticator();
            const middlewares = [
                express_flash_1.default(),
                compression_1.default(),
                express_1.default.json(),
                express_1.default.urlencoded({ extended: true })
            ];
            // * Connect to Mongo
            try {
                const redisUri = process.env.API_REDIS_URI || 'redis://localhost:6379';
                const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/boilerplate';
                mongoose_1.default.Promise = global.Promise;
                yield mongoose_1.default.connect(mongoUrl, {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                });
            }
            catch (err) {
                console.log(err);
            }
            // * Connect to redis
            let redisClient;
            try {
                const redisUri = process.env.API_REDIS_URI || 'redis://localhost:6379';
                // * Initialize Redis Client and Redis Session Store
                redisClient = redis.createClient(redisUri);
                const RedisStore = require('connect-redis')(express_session_1.default);
                const SessionStore = new RedisStore({ client: redisClient, resave: false });
                SessionStore.client.unref();
                // * Setup express session
                middlewares.push(express_session_1.default({
                    resave: true,
                    saveUninitialized: true,
                    secret: process.env.SESSION_SECRET || 'This is not a secure secret!',
                    store: SessionStore,
                    cookie: { secure: process.env.NODE_ENV === 'production' }
                }));
                middlewares.push(passportInstance.initialize());
                middlewares.push(passportInstance.session());
            }
            catch (err) {
                console.log(err);
            }
            // * Bind passport strategies
            passportInstance.use(new passport_local_1.Strategy({ usernameField: 'email' }, (email, password, done) => {
                User_1.default.findOne({ email }).then(user => {
                    if (!user)
                        return done(null, false);
                    else {
                        bcrypt_1.default.compare(password, user.password).then(result => {
                            if (result)
                                return done(user, true);
                            else
                                return done(null, false);
                        });
                    }
                });
            }));
            passportInstance.serializeUser((user, cb) => {
                return cb(null, user._id);
            });
            passportInstance.deserializeUser((id, cb) => {
                User_1.default.findOne({ _id: id }).then(user => {
                    if (user) {
                        return cb(null, utils_1.clean(user));
                    }
                    else {
                        throw new Error('User does not exist with given ID');
                    }
                });
            });
            // * Create PostgresSQL client
            yield new Promise((res) => {
                const pool = new pg_1.default.Pool({
                    user: 'postgres',
                    host: 'localhost',
                    database: 'postgres',
                    password: 'cs480',
                    port: 5432
                });
                pool.query('CREATE DATABASE finalproject', (error, results) => {
                    res();
                });
            });
            const connection = new pg_1.default.Pool({
                user: 'postgres',
                host: 'localhost',
                database: 'finalproject',
                password: 'cs480',
                port: 5432
            });
            yield connection.connect();
            // * Bind middlewares
            this.bindMiddlewares(middlewares);
            // * Create controllers
            const authCtrl = new Auth_1.Auth('/auth', passportInstance);
            const postgresCtrl = new Postgres_1.Postgres('/pg', connection);
            this.bindControllers([authCtrl, postgresCtrl]);
        });
    }
}
exports.default = App;
_app = new WeakMap(), _basePath = new WeakMap(), _serviceName = new WeakMap(), _port = new WeakMap();
//# sourceMappingURL=app.js.map