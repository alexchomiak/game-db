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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Example = void 0;
const Suite_1 = require("./Suite");
const chai_1 = require("chai");
let Example = class Example {
    beforeEach() {
        console.log('Before Each test.');
    }
    afterEach() {
        console.log('After Each Test.');
    }
    beforeAll() {
        console.log('Before All.');
    }
    afterAll() {
        console.log('After All.');
    }
    twoPlusTwo() {
        chai_1.expect(2 + 2).to.equal(4);
    }
    twoTimesTwo() {
        chai_1.expect(2 * 2).to.equal(4);
    }
    failingTest() {
        chai_1.expect(2 * 3).to.equal(5);
    }
    asyncTest() {
        return __awaiter(this, void 0, void 0, function* () {
            const val = yield new Promise(res => setTimeout(() => res(10), 1000));
            chai_1.expect(val).to.equal(10);
        });
    }
};
__decorate([
    Suite_1.BeforeEach
], Example.prototype, "beforeEach", null);
__decorate([
    Suite_1.AfterEach
], Example.prototype, "afterEach", null);
__decorate([
    Suite_1.BeforeAll
], Example.prototype, "beforeAll", null);
__decorate([
    Suite_1.AfterAll
], Example.prototype, "afterAll", null);
__decorate([
    Suite_1.Test('2 + 2 = 4')
], Example.prototype, "twoPlusTwo", null);
__decorate([
    Suite_1.Test('2 * 2 = 4')
], Example.prototype, "twoTimesTwo", null);
__decorate([
    Suite_1.Test('2 * 3 = 5')
], Example.prototype, "failingTest", null);
__decorate([
    Suite_1.Test('Async Test')
], Example.prototype, "asyncTest", null);
Example = __decorate([
    Suite_1.Suite('Example')
], Example);
exports.Example = Example;
//# sourceMappingURL=Example.test.js.map