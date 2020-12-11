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
                const queryResult = (yield this.query(query)).rows;
                this.ok(res, queryResult);
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
                const queryResult = (yield this.query('select DISTINCT genre from reviews;')).rows.map(entry => entry.genre);
                this.ok(res, queryResult);
            }
            catch (err) {
                this.clientError(res, err.toString());
            }
        });
    }
    /**
     * @description Returns all gameing platforms in dataset
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    getPlatforms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryResult = (yield this.query('select DISTINCT platform from reviews;')).rows.map(entry => entry.platform);
                this.ok(res, queryResult);
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
            if (!req.params.num) {
                this.clientError(res, "Error: Request param num was not provided. Please provide one");
            }
            try {
                const queryResult = (yield this.query(`select Title, AVG(score) as AverageScore, Genre, EditorsChoice, ReleaseYear from reviews 
                ${req.query.genre ? `WHERE genre='${req.query.genre}' ` : ''}
                group by title, genre, editorschoice, releaseyear 
                order by AVG(score) desc, releaseyear desc, title desc 
                limit ${req.params.num};`)).rows;
                this.ok(res, queryResult);
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
            try {
                const queryResult = (yield this.query(`select * from reviews where LOWER(title) like '%${req.query.q.toLowerCase()}%' order by score desc`)).rows;
                this.ok(res, queryResult);
            }
            catch (err) {
                this.clientError(res, err.toString());
            }
        });
    }
    /**
     * @description Search for games by platform
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    getGamesByPlatform(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.platform) {
                this.clientError(res, "Error: Gaming platform was not provided. Please provide one");
                return;
            }
            try {
                //* getting game data from IGN database based on provided platform
                const queryResult = (yield this.query(`SELECT * FROM reviews WHERE platform='${req.query.platform}'`)).rows;
                this.ok(res, queryResult);
            }
            catch (error) {
                this.clientError(res, error.toString());
            }
        });
    }
    /**
     * @description get all games in ascending order by title
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    getAllGamesAscending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryResult = (yield this.query(`SELECT * FROM reviews order by title`)).rows;
                this.ok(res, queryResult);
            }
            catch (error) {
                this.clientError(res, error.toString());
            }
        });
    }
    /**
     * @description get games by release year
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    getGamesByYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.year) {
                this.clientError(res, "Error: Game release year was not provided. Please provide one");
                return;
            }
            try {
                const queryResult = (yield this.query(`SELECT * FROM reviews WHERE ReleaseYear='${req.query.year}' `)).rows;
                this.ok(res, queryResult);
            }
            catch (error) {
                this.clientError(res, error.toString());
            }
        });
    }
    /**
     * @description get games by exact release date
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    getGamesByDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((!req.query.year) || (!req.query.date) || (!req.query.month)) {
                this.clientError(res, "Error: Either release year, date, or month was not provided. Please provide them");
                return;
            }
            try {
                const queryResult = (yield this.query(`SELECT * FROM reviews
                                  WHERE ReleaseYear='${req.query.year}' AND ReleaseMonth='${req.query.month}'
                                  AND ReleaseDay='${req.query.date}' `)).rows;
                this.ok(res, queryResult);
            }
            catch (error) {
                this.clientError(res, error.toString());
            }
        });
    }
    /**
     * @description get games by month
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    getGamesByMonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.month) {
                this.clientError(res, "Error: Month was not provided. Please provide one");
                return;
            }
            try {
                const queryResult = (yield this.query(`SELECT * FROM reviews WHERE ReleaseMonth='${req.query.month}'`)).rows;
                this.ok(res, queryResult);
            }
            catch (error) {
                this.clientError(res, error.toString());
            }
        });
    }
    /**
     * @description get games by genre
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    getGamesByGenre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.genre) {
                this.clientError(res, "Error: Genre was not provided. Please provide one");
                return;
            }
            try {
                const queryResult = (yield this.query(`SELECT * FROM reviews WHERE genre='${req.query.genre}'`)).rows;
                this.ok(res, queryResult);
            }
            catch (error) {
                this.clientError(res, error.toString());
            }
        });
    }
    /**
     * @description get all possible score phrases
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    getScorePhrases(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryResult = (yield this.query('select DISTINCT ScorePhrase from reviews;')).rows.map(entry => entry.scorephrase);
                this.ok(res, queryResult);
            }
            catch (err) {
                this.clientError(res, err.toString());
            }
        });
    }
    /**
     * @description get games by score phrase
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    getGamesByScorePhrase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.scorephrase) {
                this.clientError(res, "Error: Score phrase was not provided. Please provide one");
                return;
            }
            try {
                const queryResult = (yield this.query(`SELECT * FROM reviews WHERE ScorePhrase='${req.query.scorephrase}'`)).rows;
                this.ok(res, queryResult);
            }
            catch (error) {
                this.clientError(res, error.toString());
            }
        });
    }
    /**
     * @description get games by exact rating
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    getGamesByRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.rating) {
                this.clientError(res, "Error: Rating was not provided. Please provide one");
                return;
            }
            try {
                const queryResult = (yield this.query(`SELECT * FROM reviews WHERE Score='${req.query.rating}'`)).rows;
                this.ok(res, queryResult);
            }
            catch (error) {
                this.clientError(res, error.toString());
            }
        });
    }
    /**
     * @description Post request to update game rating by id. Clients will have game data rendered but id will be hidden from UI
     * @author Jigar Patel
     * @date 2020-12-05
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    updateGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, rating } = req.body;
            if (!id || !rating) {
                this.clientError(res, "Error: Either id or rating was not provided. Please provide them");
                return;
            }
            try {
                const queryResult = (yield this.query(`UPDATE reviews set Score = '${rating}' WHERE id='${id}'`)).rows;
                this.ok(res, queryResult);
            }
            catch (err) {
                this.clientError(res, err.toString());
            }
        });
    }
    /**
     * @description update game score phrase by id. Clients will have game data rendered but id will be hidden from UI
     * @author Jigar Patel
     * @date 2020-12-05
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    updateScorePhrase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, score_phrase } = req.body;
            if (!id || !score_phrase) {
                this.clientError(res, "Error: Either id or score_phrase was not provided. Please provide them");
                return;
            }
            try {
                const queryResult = (yield this.query(`UPDATE reviews set ScorePhrase = '${score_phrase}' WHERE id='${id}'`)).rows;
                this.ok(res, queryResult);
            }
            catch (err) {
                this.clientError(res, err.toString());
            }
        });
    }
    /**
     * @description post request to add a new game to the ign database
     * @author Jigar Patel
     * @date 2020-12-05
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    addGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, score_phrase, title, url, platform, score, genre, editors_choice, release_year, release_month, release_day } = req.body;
            console.log(req.body);
            // if(!id || !score_phrase || !title || !url || !platform || !score || !genre || !editors_choice || !release_year || !release_month || !release_day){
            //     this.clientError(res, "Error: Not all fields were not provided. Please provide them")
            //     return;
            // }
            try {
                const queryResult = (yield this.query(`INSERT INTO reviews (ID, ScorePhrase, Title, URL, Platform, Score, Genre, EditorsChoice, ReleaseYear, 
                                                   ReleaseMonth, ReleaseDay) VALUES('${id}', '${score_phrase}', '${title}', '${url}', '${platform}', '${score}',
                                                   '${genre}', '${editors_choice}', '${release_year}', '${release_month}', '${release_day}') `));
                this.ok(res, queryResult);
            }
            catch (err) {
                this.clientError(res, err.toString());
            }
        });
    }
    /**
     * @description post request to delete a review by id from ign DB
     * @author Jigar Patel
     * @date 2020-12-05
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id) {
                this.clientError(res, "Error: id was not provided. Please provide them");
                return;
            }
            try {
                const queryResult = (yield this.query(`DELETE FROM reviews WHERE id='${id}'`)).rows;
                this.ok(res, queryResult);
            }
            catch (err) {
                this.clientError(res, err.toString());
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
    Controller_1.Get("/platforms")
], Postgres.prototype, "getPlatforms", null);
__decorate([
    Controller_1.Get("/games/top/:num")
], Postgres.prototype, "topGames", null);
__decorate([
    Controller_1.Get("/search")
], Postgres.prototype, "getReviews", null);
__decorate([
    Controller_1.Get("/games/platform")
], Postgres.prototype, "getGamesByPlatform", null);
__decorate([
    Controller_1.Get("/games/all")
], Postgres.prototype, "getAllGamesAscending", null);
__decorate([
    Controller_1.Get("/games/year")
], Postgres.prototype, "getGamesByYear", null);
__decorate([
    Controller_1.Get("/games/date")
], Postgres.prototype, "getGamesByDate", null);
__decorate([
    Controller_1.Get("/games/month")
], Postgres.prototype, "getGamesByMonth", null);
__decorate([
    Controller_1.Get("/games/genre")
], Postgres.prototype, "getGamesByGenre", null);
__decorate([
    Controller_1.Get("/scorephrases")
], Postgres.prototype, "getScorePhrases", null);
__decorate([
    Controller_1.Get("/games/scorephrase")
], Postgres.prototype, "getGamesByScorePhrase", null);
__decorate([
    Controller_1.Get("/games/rating")
], Postgres.prototype, "getGamesByRating", null);
__decorate([
    Controller_1.Post("/games/update_rating") // fixme: look up rest standards & change this as necessary
], Postgres.prototype, "updateGame", null);
__decorate([
    Controller_1.Post("/games/update_score_phrase")
], Postgres.prototype, "updateScorePhrase", null);
__decorate([
    Controller_1.Post("/games/add")
], Postgres.prototype, "addGame", null);
__decorate([
    Controller_1.Post("/games/delete")
], Postgres.prototype, "deleteById", null);
exports.Postgres = Postgres;
//# sourceMappingURL=Postgres.js.map