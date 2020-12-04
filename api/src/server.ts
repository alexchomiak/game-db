// * Retrieve environment variables
require('dotenv').config()
import App from './app'

/**
 * Start Express server.
 */
const app = new App(parseInt(process.env.API_PORT) || 5000, '/api', 'CS480 Final Project')

;(async () => {
    await app.init()
    app.listen()
})()
