import app from './api/app.js';
import * as dotenv from "dotenv/config";
const port = process.env.PORT || 8080;
app.listen(port, () =>{
    console.log(`Server is running on ${port}.`)
})
