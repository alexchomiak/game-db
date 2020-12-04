import { Controller, Get, Post } from "./Controller";
import {Request, Response} from 'express'
import {Pool, QueryResult} from 'pg'
export class Postgres extends Controller {

    private client: Pool
    constructor(path: string, pgClient: Pool) {
        super(path)
        this.client = pgClient
        
    }

    private async query( queryStr: string): Promise<QueryResult<any>> {
        return new Promise( (res,rej) => this.client.query(queryStr, (err, result) => {
            if(err) rej(err)
            else res(result)
        }))
    }

    @Get('/')
    base(req: Request, res: Response) {
        res.send("POSTGRES DB!");        
    }

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

    @Get("/genres")
    async genres(req: Request, res: Response)  {
        try {
            this.ok(res, (await this.query('select DISTINCT genre from reviews;')).rows.map(entry => entry.genre))
        }

        catch(err) {
            this.clientError(res, err.toString())
        }

    }

    @Get("/games/top/:num") 
    async topGames(req: Request, res: Response) {
        try {
            this.ok(res, (await this.query(`select Title, AVG(score) as AverageScore, Genre, EditorsChoice, ReleaseYear from reviews 
            ${req.query.genre ? `WHERE genre='${req.query.genre}' ` : ''}
            group by title, genre, editorschoice, releaseyear 
            order by AVG(score) desc, releaseyear desc, title desc 
            limit ${req.params.num};`)).rows)
        }
        catch(err) {
            console.log(err)
            this.clientError(res, err.toString())
        }
    }


    @Get("/games/:genre")
    genre() {}

}