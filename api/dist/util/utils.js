"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clean = exports.isAuthenticated = void 0;
exports.isAuthenticated = (req, res, next) => {
    if (req.user)
        next();
    else
        res.status(401).send('This route requires authentication!');
};
exports.clean = (user) => {
    let obj = user.toJSON();
    console.log(user);
    delete obj.password;
    // delete obj._id
    delete obj.__v;
    return obj;
};
//# sourceMappingURL=utils.js.map