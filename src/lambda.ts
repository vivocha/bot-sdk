import * as express from 'express';
import { API } from 'arrest';

export function toLambda(application: API): express.Application {
    const app = express();
    app.use(async (req, res, next) => {
        const router = await application.router();
        router(req, res, next);
    });
    return app;
}

