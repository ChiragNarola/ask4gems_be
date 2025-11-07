import { RequestHandler } from 'express';
import auth from 'basic-auth';
import { AppSettings } from '../utils/config';

export function staticAuth(): RequestHandler {
    return ((req, res, next) => {
        const isHTML = req.path.endsWith('.html');
        const isIndex = req.path === '/index.html';
        if (isHTML && !isIndex) {
            const user = auth(req);
            if (user && user.name === AppSettings.basicAuthUser.userName && user.pass === AppSettings.basicAuthUser.password)
                return next();
            res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
            return res.status(401).send('Authentication required.');
        }
        next();
    }) as RequestHandler;
}