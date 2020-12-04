"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const Controller_1 = require("./Controller");
class Content extends Controller_1.Controller {
    index(req, res) {
        this.render(res, 'home', { user: req.user });
    }
}
__decorate([
    Controller_1.Get("/")
], Content.prototype, "index", null);
exports.Content = Content;
//# sourceMappingURL=Content.js.map