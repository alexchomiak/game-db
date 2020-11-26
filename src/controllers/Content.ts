import { Controller, Get } from "./Controller";
import { Request, Response } from 'express'
export class Content extends Controller {
    @Get("/") 
    index(req: Request, res: Response) {
        this.render(res, 'home', {user: req.user})
    }
}