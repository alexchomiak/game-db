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
exports.Postgres = void 0;
const Controller_1 = require("./Controller");
class Postgres extends Controller_1.Controller {
    constructor(path, pgClient) {
        super(path);
        this.client = pgClient;
    }
    query(queryStr) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => this.client.query(queryStr, (err, result) => {
                if (err)
                    rej(err);
                else
                    res(result);
            }));
        });
    }
    base(req, res) {
        res.send("POSTGRES DB!");
    }
    makeQuery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = req.body;
            try {
                this.ok(res, yield this.query(query));
            }
            catch (err) {
                this.clientError(res, err.toString());
            }
        });
    }
    genres(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.ok(res, (yield this.query('select DISTINCT genre from reviews;')).rows.map(entry => entry.genre));
            }
            catch (err) {
                this.clientError(res, err.toString());
            }
        });
    }
    topGames(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.ok(res, (yield this.query(`select Title, AVG(score) as AverageScore, Genre, EditorsChoice, ReleaseYear from reviews 
            ${req.query.genre ? `WHERE genre='${req.query.genre}' ` : ''}
            group by title, genre, editorschoice, releaseyear 
            order by AVG(score) desc, releaseyear desc, title desc 
            limit ${req.params.num};`)).rows);
            }
            catch (err) {
                console.log(err);
                this.clientError(res, err.toString());
            }
        });
    }
    genre() { }
}
__decorate([
    Controller_1.Get('/')
], Postgres.prototype, "base", null);
__decorate([
    Controller_1.Post("/query")
], Postgres.prototype, "makeQuery", null);
__decorate([
    Controller_1.Get("/genres")
], Postgres.prototype, "genres", null);
__decorate([
    Controller_1.Get("/games/top/:num")
], Postgres.prototype, "topGames", null);
__decorate([
    Controller_1.Get("/games/:genre")
], Postgres.prototype, "genre", null);
exports.Postgres = Postgres;
//# sourceMappingURL=Postgres.js.map