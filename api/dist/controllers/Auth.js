"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const Controller_1 = require("./Controller");
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../util/utils");
class Auth extends Controller_1.Controller {
    /**
     *Creates an instance of Auth Controller
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {string} path
     * @param {passport.Authenticator} authenticator
     * @memberof Auth
     */
    constructor(path, authenticator) {
        super(path);
        this.authenticator = authenticator;
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
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = req.body;
            if (!email || !password || !firstName || !lastName) {
                this.clientError(res, 'Registration error, did you provide an email and correctly formatted credentials?');
                return;
            }
            if (!(yield User_1.default.findOne({ email }))) {
                const user = yield new User_1.default({
                    email,
                    password: yield bcrypt_1.default.hash(password, 9),
                    firstName,
                    lastName,
                }).save();
                req.logIn(user, () => this.ok(res, utils_1.clean(user)));
            }
            else {
                this.clientError(res, 'User already exists with the given credentials.');
            }
        });
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
    loginUser(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            this.clientError(res, 'Authentication error, did you provide an email and correctly formatted credentials?');
            return;
        }
        this.authenticator.authenticate('local', user => {
            if (!user)
                this.clientError(res, 'Authentication error. Is this the correct email?');
            else
                req.logIn(user, () => this.ok(res, utils_1.clean(user)));
        })(req, res);
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
    logout(req, res) {
        req.logout();
        this.ok(res, 'ok');
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
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ok(res, utils_1.clean(yield User_1.default.findOne({ _id: req.user._id })));
        });
    }
}
__decorate([
    Controller_1.Post('/register')
], Auth.prototype, "registerUser", null);
__decorate([
    Controller_1.Post('/login')
], Auth.prototype, "loginUser", null);
__decorate([
    Controller_1.All('/logout'),
    Controller_1.Authenticated()
], Auth.prototype, "logout", null);
__decorate([
    Controller_1.Get('/user'),
    Controller_1.Authenticated()
], Auth.prototype, "getUser", null);
exports.Auth = Auth;
//# sourceMappingURL=Auth.js.map