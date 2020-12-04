const pg = require('pg')
const csv = require('fast-csv')
const fs = require('fs')
const process = require('process')
;(async () => {


    /*
        * IMPORT POSTGRES DATA *
        
    */
   await new Promise(done => {
 const ignData = []
    fs.createReadStream('./data/ign.csv').pipe(
        csv
        .parse()
        .on("data", (data) => {
            ignData.push(data)
        })
        .on("end",async  () => {
            ignData.shift()
             // * Create FinalProject DB
            await new Promise((res) => {
                const pool = new pg.Pool({
                user: 'postgres',
                host: 'localhost',
                database: 'postgres',
                password: 'cs480',
                    port: 5432
                })
                
                pool.query('CREATE DATABASE finalproject' ,(error, results) => {
                    res()
                })
            
            })
            
            // * Create connection
            const connection = new pg.Pool({
                user: 'postgres',
                host: 'localhost',
                database: 'finalproject',
                password: 'cs480',
                    port: 5432
                })
            await connection.connect()
            // * Create Table
            // id,score_phrase,title,url,platform,score,genre,editors_choice,release_year,release_month,release_day
            
            console.log("Creating reviews table in Postgres")

            await new Promise(res => connection.query(`DROP TABLE IF EXISTS reviews`,res))
            await new Promise(res => connection.query(`CREATE TABLE IF NOT EXISTS reviews(
                ID serial PRIMARY KEY,
                ScorePhrase VARCHAR(100),
                Title VARCHAR(250),
                URL VARCHAR(250),
                Platform VARCHAR(100),
                Score double precision,
                Genre VARCHAR(100),
                EditorsChoice boolean,
                ReleaseYear int,
                ReleaseMonth int,
                ReleaseDay int
            )`, (err, results) => {
                if(err) {
                    console.log(err)
                    process.exit(0)
                } else {
                    res()
                }
            }))
            let insertions = []
            ignData.forEach((row, i) => {
                if( row[7] == 'Y') row[7] = 'true'
                else row[7] = 'false'
                const prom = new Promise((res,rej) => connection.query(`
                    INSERT INTO reviews VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
                `, row ,(err, result)  => {
                    if(err) {
                        console.log(err)
                        process.exit(1)
                    }
                    res()
                }))
                insertions.push(
                    prom 
                )
         
            })
            console.log("Inserting IGN values into Postgres.")
            await Promise.all(insertions)
            console.log("Data is ready in reviews table in Postgres.")
            done()
        })
    )
   })
   process.exit(0)
  

    


})()