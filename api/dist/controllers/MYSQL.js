"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MYSQL = void 0;
const Controller_1 = require("./Controller");
class MYSQL extends Controller_1.Controller {
    constructor(path) {
        super(path);
    }
    base(req, res) {
        res.send("MYSQL DB!");
    }
    query(req, res) {
    }
}
__decorate([
    Controller_1.Get('/')
], MYSQL.prototype, "base", null);
__decorate([
    Controller_1.Post("/query")
], MYSQL.prototype, "query", null);
exports.MYSQL = MYSQL;
//# sourceMappingURL=MYSQL.js.map