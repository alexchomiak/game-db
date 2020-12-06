"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = exports.All = exports.Delete = exports.Put = exports.Post = exports.Get = exports.DevelopmentOnly = exports.NeedsSharedSecret = exports.Authenticated = void 0;
const express_1 = require("express");
exports.Authenticated = (redirect_uri) => (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
        const context = this;
        let args = arguments;
        const req = args[0];
        const res = args[1];
        if (!req.user) {
            if (redirect_uri != undefined)
                res.redirect(redirect_uri);
            else if (process.env.NODE_ENV == 'production')
                res.status(404).send('Specified path not found.');
            else
                res.status(401).send('This URL requires authentication.');
        }
        else
            originalMethod.apply(context, args);
    };
    return descriptor;
};
exports.NeedsSharedSecret = (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
        const context = this;
        let args = arguments;
        const req = args[0];
        const res = args[1];
        if (!req.body.shared_secret ||
            req.body.shared_secret != (process.env.SHARED_SECRET || 'CS480 FINAL')) {
            if (process.env.NODE_ENV == 'production')
                res.status(404).send('Specified path not found.');
            else
                res.status(401).send('This URL requires the shared secret.');
        }
        else
            originalMethod.apply(context, args);
    };
};
exports.DevelopmentOnly = (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function () {
        const context = this;
        let args = arguments;
        const req = args[0];
        const res = args[1];
        if (process.env.NODE_ENV == 'production') {
            res.status(404).send('Specified path not found.');
        }
        else
            originalMethod.apply(context, args);
    };
};
const RouteDecorator = (method, path, middlewares) => {
    return (target, propertyKey, descriptor) => {
        if (Object.getOwnPropertyDescriptor(target, 'routes') == null)
            target.routes = [];
        target.routes.push({
            path,
            method,
            middlewares: middlewares && middlewares.length > 0 ? middlewares : [],
            handler: descriptor.value
        });
        return descriptor;
    };
};
exports.Get = (path, middlewares) => {
    return RouteDecorator('get', path, middlewares);
};
exports.Post = (path, middlewares) => {
    return RouteDecorator('post', path, middlewares);
};
exports.Put = (path, middlewares) => {
    return RouteDecorator('put', path, middlewares);
};
exports.Delete = (path, middlewares) => {
    return RouteDecorator('delete', path, middlewares);
};
exports.All = (path, middlewares) => {
    return RouteDecorator('all', path, middlewares);
};
class Controller {
    constructor(path) {
        this.path = path;
        this.router = express_1.Router();
    }
    static jsonResponse(response, code, message) {
        return response.status(code).json({ message });
    }
    bindRoutes() {
        this.routes.forEach(route => {
            switch (route.method) {
                case 'get':
                    this.router.get(route.path, ...route.middlewares, route.handler.bind(this));
                    break;
                case 'post':
                    this.router.post(route.path, ...route.middlewares, route.handler.bind(this));
                    break;
                case 'delete':
                    this.router.delete(route.path, ...route.middlewares, route.handler.bind(this));
                    break;
                case 'put':
                    this.router.put(route.path, ...route.middlewares, route.handler.bind(this));
                    break;
                case 'all':
                default:
                    this.router.all(route.path, ...route.middlewares, route.handler.bind(this));
            }
        });
    }
    ok(res, data) {
        if (data) {
            res.type('application/json');
            return res.status(200).json(data);
        }
        else {
            return res.sendStatus(200);
        }
    }
    created(response) {
        response.sendStatus(201);
    }
    accepted(response) {
        response.sendStatus(202);
    }
    clientError(response, message) {
        Controller.jsonResponse(response, 400, message ? message : 'Unauthorized');
    }
    unauthorized(response, message) {
        Controller.jsonResponse(response, 401, message ? message : 'Unauthorized');
    }
    forbidden(response, message) {
        Controller.jsonResponse(response, 403, message ? message : 'Forbidden');
    }
    notFound(response, message) {
        Controller.jsonResponse(response, 404, message ? message : 'Not found');
    }
    conflict(response, message) {
        Controller.jsonResponse(response, 409, message ? message : 'Conflict');
    }
    tooMany(response, message) {
        Controller.jsonResponse(response, 429, message ? message : 'Too many requests');
    }
    notImplemented(response, message) {
        Controller.jsonResponse(response, 501, message ? message : 'Not Implemented');
    }
    fail(response, error) {
        console.log(error);
        return response.status(500).json({
            message: error.toString()
        });
    }
    render(response, view, data) {
        response.render(view, data);
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map