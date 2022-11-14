import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import v1 from './routes/index.routes.js';
import pkg from '../package.json' assert { type: "json" };
import pool from './services/db.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.get('/', (_, res) => res.status(200).json({
    message: 'Welcome to the Paidify API Gateway',
    version: pkg.version,
    author: pkg.author,
    description: pkg.description,
}));
app.get('/ping', async (_, res) => {
    let result = 'Monitor DB says: ';
    try {
        result += (await pool.query('SELECT "Pong!" AS result'))[0][0].result;
    } catch (err) {
        console.log(err);
        result += 'Cannot connect to DB';
    }
    res.status(200).json({ message: result });
});
app.use('/v1', v1);
// app.use((_, res) => res.status(404).json({ message: 'Not Found' }));

export default app;
