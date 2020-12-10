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
            const queryResult = (await this.query(query)).rows;
            this.ok(res, queryResult)
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
            const queryResult = (await this.query('select DISTINCT genre from reviews;')).rows.map(entry => entry.genre)
            this.ok(res, queryResult)
        }

        catch(err) {
            this.clientError(res, err.toString())
        }

    }

    /**
     * @description Returns all gameing platforms in dataset
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    @Get("/platforms")
    async getPlatforms(req: Request, res: Response)  {
        
        try {
            const queryResult = (await this.query('select DISTINCT platform from reviews;')).rows.map(entry => entry.platform);
            this.ok(res, queryResult)
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

        if(!req.params.num){
            this.clientError(res, "Error: Request param num was not provided. Please provide one")
        }

        try {
            const queryResult = (await this.query(
                `select Title, AVG(score) as AverageScore, Genre, EditorsChoice, ReleaseYear from reviews 
                ${req.query.genre ? `WHERE genre='${req.query.genre}' ` : ''}
                group by title, genre, editorschoice, releaseyear 
                order by AVG(score) desc, releaseyear desc, title desc 
                limit ${req.params.num};`
            )).rows

            this.ok(res, queryResult)
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
        } 
                    
        try {
            const queryResult = (await this.query(`select * from reviews where LOWER(title) like '%${(req.query.q as string).toLowerCase()}%' order by score desc`)).rows
            this.ok(res, queryResult)
        }
        catch(err) {
            this.clientError(res, err.toString())
        }   
        
    }
    
    /**
     * @description Search for games by platform
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */    
    @Get("/games/platform")
    async getGamesByPlatform(req: Request, res: Response) {
        if(!req.query.platform){
            this.clientError(res, "Error: Gaming platform was not provided. Please provide one")
            return;
        }

        try {            
            //* getting game data from IGN database based on provided platform
            const queryResult =  (await this.query(`SELECT * FROM reviews WHERE platform='${req.query.platform}'`)).rows                
            this.ok(res, queryResult);
        } catch (error) {
            this.clientError(res, error.toString())
        }
}

    /**
     * @description get all games in ascending order by title
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */     
    @Get("/games/all")
    async getAllGamesAscending(req: Request, res: Response) {
        try {            
            const queryResult =  (await this.query(`SELECT * FROM reviews order by title` )).rows            
            this.ok(res, queryResult);
        } catch (error) {
            this.clientError(res, error.toString())
        }            
    }    


    /**
     * @description get games by release year
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */   
    @Get("/games/year")
    async getGamesByYear(req: Request, res: Response) {
        if(!req.query.year){
            this.clientError(res, "Error: Game release year was not provided. Please provide one")
            return;
        }

        try {            
            const queryResult =  (await this.query(`SELECT * FROM reviews WHERE ReleaseYear='${req.query.year}' `)).rows                
            this.ok(res, queryResult);
        } catch (error) {
            this.clientError(res, error.toString())
        }
    }

    /**
     * @description get games by exact release date
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */       
    @Get("/games/date")
    async getGamesByDate(req: Request, res: Response) {
        if( (!req.query.year) || (!req.query.date) || (!req.query.month) ){
            this.clientError(res, "Error: Either release year, date, or month was not provided. Please provide them")
            return;
        }

        try {                
            const queryResult =  (await this.query(`SELECT * FROM reviews
                                  WHERE ReleaseYear='${req.query.year}' AND ReleaseMonth='${req.query.month}'
                                  AND ReleaseDay='${req.query.date}' `)).rows                

            this.ok(res, queryResult);
        } catch (error) {
            this.clientError(res, error.toString())
        }            
    }


    /**
     * @description get games by month
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */       
    @Get("/games/month")
    async getGamesByMonth(req: Request, res: Response) {
        if(!req.query.month){
            this.clientError(res, "Error: Month was not provided. Please provide one")
            return;
        }

        try {                
            const queryResult =  (await this.query(`SELECT * FROM reviews WHERE ReleaseMonth='${req.query.month}'`)).rows                
            this.ok(res, queryResult);
        } catch (error) {
            this.clientError(res, error.toString())
        }            
    }    

    /**
     * @description get games by genre
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */     
    @Get("/games/genre")
    async getGamesByGenre(req: Request, res: Response) {
        if(!req.query.genre){
            this.clientError(res, "Error: Genre was not provided. Please provide one")
            return;
        }

        try {            
            const queryResult =  (await this.query(`SELECT * FROM reviews WHERE genre='${req.query.genre}'`)).rows                
            this.ok(res, queryResult);
        } catch (error) {
            this.clientError(res, error.toString())
        }
    }       


    /**
     * @description get all possible score phrases
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */
    @Get("/scorephrases")
    async getScorePhrases(req: Request, res: Response)  {
        
        try {
            const queryResult = (await this.query('select DISTINCT ScorePhrase from reviews;')).rows.map(entry => entry.scorephrase);
            this.ok(res, queryResult)
        }
        catch(err) {
            this.clientError(res, err.toString())
        }

    }    


    /**
     * @description get games by score phrase
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */     
    @Get("/games/scorephrase")
    async getGamesByScorePhrase(req: Request, res: Response) {
        if(!req.query.scorephrase){
            this.clientError(res, "Error: Score phrase was not provided. Please provide one")
            return;
        }

        try {
            const queryResult =  (await this.query(`SELECT * FROM reviews WHERE ScorePhrase='${req.query.scorephrase}'`)).rows                
            this.ok(res, queryResult);
        } catch (error) {
            this.clientError(res, error.toString())
        }
                
    }   
    
    /**
     * @description get games by exact rating 
     * @author Jigar Patel
     * @date 2020-12-04
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */      
    @Get("/games/rating")
    async getGamesByRating(req: Request, res: Response) {
        if(!req.query.rating){
            this.clientError(res, "Error: Rating was not provided. Please provide one")
            return;
        }

        try {            
            const queryResult =  (await this.query(`SELECT * FROM reviews WHERE Score='${req.query.rating}'`)).rows                
            this.ok(res, queryResult);
        } catch (error) {
            this.clientError(res, error.toString())
        }
        
    
    }   
        

    /**
     * @description Post request to update game rating by id. Clients will have game data rendered but id will be hidden from UI
     * @author Jigar Patel
     * @date 2020-12-05
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */ 
     @Post("/games/update_rating") // fixme: look up rest standards & change this as necessary
     async updateGame(req: Request, res: Response) {
         const {id, rating} = req.body

         if(!id || !rating){
            this.clientError(res, "Error: Either id or rating was not provided. Please provide them")
            return;
         }
 
         try {
             const queryResult = (await this.query(`UPDATE reviews set Score = '${rating}' WHERE id='${id}'`)).rows 
             this.ok(res, queryResult)
         }
         catch(err) {
             this.clientError(res, err.toString())
         }
 
     }     


    /**
     * @description update game score phrase by id. Clients will have game data rendered but id will be hidden from UI
     * @author Jigar Patel
     * @date 2020-12-05
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */      
    @Post("/games/update_score_phrase")
    async updateScorePhrase(req: Request, res: Response) {
        const {id, score_phrase} = req.body

        if(!id || !score_phrase){
           this.clientError(res, "Error: Either id or score_phrase was not provided. Please provide them")
           return;
        }

        try {
            const queryResult = (await this.query(`UPDATE reviews set ScorePhrase = '${score_phrase}' WHERE id='${id}'`)).rows 
            this.ok(res, queryResult)
        }
        catch(err) {
            this.clientError(res, err.toString())
        }

    }    



    /**
     * @description post request to add a new game to the ign database
     * @author Jigar Patel
     * @date 2020-12-05
     * @param {Request} req
     * @param {Response} res
     * @memberof Postgres
     */     
    @Post("/games/add")
    async addGame(req: Request, res: Response) {
        const {id, score_phrase, title, url, platform, score, genre, editors_choice, release_year, release_month, release_day } = req.body

        console.log(req.body);

        if(!id || !score_phrase || !title || !url || !platform || !score || !genre || !editors_choice || !release_year || !release_month || !release_day){
            this.clientError(res, "Error: Not all fields were not provided. Please provide them")
            return;
        }

        try {        
            const queryResult = (await this.query(`INSERT INTO reviews (ID, ScorePhrase, Title, URL, Platform, Score, Genre, EditorsChoice, ReleaseYear, 
                                                   ReleaseMonth, ReleaseDay) VALUES('${id}', '${score_phrase}', '${title}', '${url}', '${platform}', '${score}',
                                                   '${genre}', '${editors_choice}', '${release_year}', '${release_month}', '${release_day}') `)).rows 
                                                   
            this.ok(res, queryResult)
        }
        catch(err) {
            this.clientError(res, err.toString())
        }

    } 



    /*
    
    commit message & PR details

    update query ideas
        - update rating
        - update score_phrase - 15
    
    insert 
        - add a new game review - 10

    refractor
        - removed else syntax for readability
        - requiring req.body data for post requests
        - for initial queries: putting queries in a seperate variable for readability

    note to team: I'm just doing some of these random queries since deitz wanted various CRUD operations

    */
    


}