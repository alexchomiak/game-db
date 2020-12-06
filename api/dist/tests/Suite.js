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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Suite = exports.AfterAll = exports.AfterEach = exports.BeforeAll = exports.BeforeEach = exports.Test = exports.TestingInstance = void 0;
const mocha_1 = __importStar(require("mocha"));
exports.TestingInstance = new mocha_1.default();
exports.Test = (title) => {
    return (target, propertyKey, descriptor) => {
        if (Object.getOwnPropertyDescriptor(target, 'tests') == null) {
            Object.defineProperty(target, 'tests', {
                value: [{ fn: descriptor.value, title }]
            });
        }
        else
            Object.getOwnPropertyDescriptor(target, 'tests').value.push({
                fn: descriptor.value,
                title
            });
        return descriptor;
    };
};
exports.BeforeEach = (target, propertyKey, descriptor) => {
    if (Object.getOwnPropertyDescriptor(target, '__beforeEach__') == null)
        Object.defineProperty(target, '__beforeEach__', {
            value: descriptor.value
        });
    return descriptor;
};
exports.BeforeAll = (target, propertyKey, descriptor) => {
    if (Object.getOwnPropertyDescriptor(target, '__beforeAll__') == null)
        Object.defineProperty(target, '__beforeAll__', {
            value: descriptor.value
        });
    return descriptor;
};
exports.AfterEach = (target, propertyKey, descriptor) => {
    if (Object.getOwnPropertyDescriptor(target, '__afterEach__') == null)
        Object.defineProperty(target, '__afterEach__', {
            value: descriptor.value
        });
    return descriptor;
};
exports.AfterAll = (target, propertyKey, descriptor) => {
    if (Object.getOwnPropertyDescriptor(target, '__afterAll__') == null)
        Object.defineProperty(target, '__afterAll__', {
            value: descriptor.value
        });
    return descriptor;
};
exports.Suite = (title) => {
    return (target) => {
        const obj = new target();
        const suite = mocha_1.default.Suite.create(exports.TestingInstance.suite, title);
        if (obj.tests && obj.tests.length > 0)
            obj.tests.forEach((t) => {
                suite.addTest(new mocha_1.Test(t.title, t.fn.bind(obj)));
            });
        if (obj.__beforeAll__)
            suite.beforeAll(obj.__beforeAll__);
        if (obj.__beforeEach__)
            suite.beforeEach(obj.__beforeEach__);
        if (obj.__afterAll__)
            suite.afterAll(obj.__afterAll__);
        if (obj.__afterEach__)
            suite.afterEach(obj.__afterEach__);
        return target;
    };
};
//# sourceMappingURL=Suite.js.map