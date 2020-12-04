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
    /**
     *Creates an instance of Postgres Controller
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {string} path
     * @param {Pool} pgClient
     * @memberof Postgres
     */
    constructor(path, pgClient) {
        super(path);
        this.client = pgClient;
    }
    /**
     * @description Wrapper that Queries PG database with queryStr
     * @author Alex Chomiak
     * @date 2020-12-03
     * @private
     * @param {string} queryStr
     * @returns {Promise<QueryResult<any>>}
     * @memberof Postgres
     */
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
    /**
     * @description Post request that allows for query by API user
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
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
    /**
     * @description Returns all game Genres in dataset
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
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
    /**
     * @description Returns top n games from dataset. User can specify Genre in query string
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
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
                this.clientError(res, err.toString());
            }
        });
    }
    /**
     * @description Allows user to search for reviews by game title
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.q) {
                this.clientError(res, "You must specify a text query q to obtain reviews for");
                return;
            }
            else {
                console.log(req.query.q);
                try {
                    this.ok(res, (yield this.query(`select * from reviews where title like '%${req.query.q}%' order by score desc`)).rows);
                }
                catch (err) {
                    this.clientError(res, err.toString());
                }
            }
        });
    }
}
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
    Controller_1.Get("/search")
], Postgres.prototype, "getReviews", null);
exports.Postgres = Postgres;
//# sourceMappingURL=Postgres.js.map