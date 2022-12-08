import app from './api/app.js';
import * as dotenv from "dotenv/config";
const port = process.env.PORT || 8080;

// Server is running on port 8080 by default.
app.listen(port, () =>{
    console.log(`Server is running on ${port}.`)
})
