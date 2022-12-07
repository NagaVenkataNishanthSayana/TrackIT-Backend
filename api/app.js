import express from 'express';
import cors from 'cors'
import routes from './routes/index.js';
import connectToMongoDB from './database/index.js';


const app = express();
const { CORS_ENABLED_ORIGIN, MONGO_URL } = process.env
var corsOptions = {
  origin: CORS_ENABLED_ORIGIN
};

// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true}))


// Register all routes
routes(app);

connectToMongoDB(MONGO_URL).then(() => {
  console.log("Connected to the database!");
})
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

export default app;