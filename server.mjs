import Koa from 'koa';
import send from 'koa-send';
import serve from 'koa-static';
import { createServer } from 'http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, 'build');


startup(new Koa());

async function forceHttps(ctx, next) {
    if (process.env.NODE_ENV === 'development') {
        return next();
    }
    if (ctx.request.headers['x-forwarded-proto'] !== 'https') {
        return ctx.redirect(
            [
                'https://',
                ctx.request.get('Host'),
                ctx.request.url].join(''),
        );
    }
    return next();
}

async function serveIndex(ctx) {
    await send(ctx, 'index.html', { root });
}

async function startup(app) {
    app
        .use(forceHttps)
        .use(serve(root))
        .use(serveIndex)
        ;

    const port = process.env.PORT || 5000;
    createServer(app.callback())
        .listen(port);
}
