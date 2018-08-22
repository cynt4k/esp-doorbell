import express, { NextFunction, Response, Request } from 'express';
import logger from 'morgan';
import lusca from 'lusca';
import bodyParser from 'body-parser';
import compression from 'compression';

let logLevel: string = 'dev';

const app: express.Express = express();

app.set('port', process.env.PORT || 3000);
app.use(compression());
if (process.env.NODE_ENV !== 'test') {
    app.use(logger(logLevel));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
   res.status(200).send('OK');
});

export default app;