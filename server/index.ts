import Koa from 'koa';
import * as send from 'koa-send';
import * as http from 'http';

startup(new Koa());

const forceHttps: Koa.Middleware = (ctx, next) => {
    if (ctx.request.headers['x-forwarded-proto'] !== 'https') {
        return ctx.redirect(
            [
                'https://',
                ctx.request.get('Host'),
                ctx.request.url].join(''),
        );
    }
    return next();
};

const serveIndex: Koa.Middleware = async (ctx) => {
    await send(ctx, 'index.html', { root: __dirname + '/build' });
};

async function startup(app: Koa) {
    app.use(serveIndex);

    const port = process.env.PORT || 5000;
    http.createServer(app.callback())
        .listen(port);
}
