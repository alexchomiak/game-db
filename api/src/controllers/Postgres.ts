import { Controller, Get, Post } from "./Controller";
import {Request, Response} from 'express'
import {Pool, QueryResult} from 'pg'
export class Postgres extends Controller {
    private client: Pool

    /**
     *Creates an instance of Postgres Controller
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {string} path
     * @param {Pool} pgClient
     * @memberof Postgres
     */
    constructor(path: string, pgClient: Pool) {
        super(path)
        this.client = pgClient
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
    private async query( queryStr: string): Promise<QueryResult<any>> {
        return new Promise( (res,rej) => this.client.query(queryStr, (err, result) => {
            if(err) rej(err)
            else res(result)
        }))
    }

    

    /**
     * @description Post request that allows for query by API user
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    @Post("/query")
    async makeQuery(req: Request, res: Response) {
        const {query} = req.body

        try {
            this.ok(res, await this.query(query))
        }

        catch(err) {
            this.clientError(res, err.toString())
        }

    }

    /**
     * @description Returns all game Genres in dataset
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    @Get("/genres")
    async genres(req: Request, res: Response)  {
        try {
            this.ok(res, (await this.query('select DISTINCT genre from reviews;')).rows.map(entry => entry.genre))
        }

        catch(err) {
            this.clientError(res, err.toString())
        }

    }


    /**
     * @description Returns top n games from dataset. User can specify Genre in query string
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    @Get("/games/top/:num") 
    async topGames(req: Request, res: Response) {
        try {
            this.ok(res, 
                (await this.query(
                    `select Title, AVG(score) as AverageScore, Genre, EditorsChoice, ReleaseYear from reviews 
                    ${req.query.genre ? `WHERE genre='${req.query.genre}' ` : ''}
                    group by title, genre, editorschoice, releaseyear 
                    order by AVG(score) desc, releaseyear desc, title desc 
                    limit ${req.params.num};`
                )).rows
            )
        }
        catch(err) {
            this.clientError(res, err.toString())
        }
    }

    /**
     * @description Allows user to search for reviews by game title
     * @author Alex Chomiak
     * @date 2020-12-03
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    @Get("/search")
    async getReviews(req: Request, res: Response) {
        if(!req.query.q) {
            this.clientError(res, "You must specify a text query q to obtain reviews for")
            return
        } else {
            console.log(req.query.q)
            try {
                this.ok(
                    res,
                    (await this.query(
                        `select * from reviews where title like '%${req.query.q}%' order by score desc`
                    )).rows
                )
            }
            catch(err) {
            this.clientError(res, err.toString())
            }   
        }
    }   
}