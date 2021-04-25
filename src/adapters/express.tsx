import { Server } from "node:http";

import express, { Express, RequestHandler, Router, RouterOptions } from "express";
import { isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { AdapterApplicationProps, Application } from "../core/Application";
import { RequestContext } from "../core/Route";
import { AppAdapter, RegisterProps, RequestHandlerProps, RouterAdapter } from "../types";
import { makeHtmlResponse } from "../utils";

export type { RequestHandler as ExpressRequestHandler };
interface ExpressAdapter extends AppAdapter<Express> {
    _app: Express;
    _server: Server;
}
interface ExpressRequestContextData {
    middlewares: RequestHandler[];
}

const ExpressAdapter: ExpressAdapter = {
    _app: (undefined as unknown) as Express,
    _server: (undefined as unknown) as Server,
    make() {
        (this as ExpressAdapter)._app = express();
        return (this as ExpressAdapter)._app;
    },
    listen({ port }: { port: number }) {
        this._server = (this as ExpressAdapter)._app.listen(port);
    },
    close() {
        (this as ExpressAdapter)._server?.close();
    },
    use(handler: RequestHandler) {
        (this as ExpressAdapter)._app.use(handler);
    },
    handler({ children: childrenProp, router, context }: RequestHandlerProps<ExpressRequestContextData>) {
        const middlewares = context.middlewares || [];

        const handler: RequestHandler = async (req, res, next) => {
            if (middlewares.length) {
                for (const mw of middlewares) {
                    try {
                        await mw(req, res, next);
                    } catch (e) {
                        return res.send(makeHtmlResponse({ body: "Internal server error" }));
                    }
                }
            }

            const children = typeof childrenProp === "function" ? childrenProp({ req, res, next }) : childrenProp;

            try {
                const body = isValidElement(children)
                    ? renderToStaticMarkup(
                          <RequestContext.Provider value={{ req, res, next, appAdapter: this, router, context }}>
                              {children}
                          </RequestContext.Provider>
                      )
                    : children;

                if (!body) return res.end();

                if (typeof body === "string") {
                    // res.send(makeHtmlResponse({ body }));
                    // console.log({ body });
                    // res.set({ "Content-Type": "text/plain" }).send(body);
                    // res.send(Buffer.from(body));
                    res.end(body);
                } else if (typeof body === "object") {
                    // Renders object/array as JSON
                    res.send(body);
                }
            } catch (error) {
                // Global error handler
                console.error(error);
                res.status(500).send(makeHtmlResponse({ body: "Internal server error" }));
            }
        };

        return handler;
    },
};
const ExpressRouterAdapter: RouterAdapter<Router, RouterOptions> = {
    make: (props) => express.Router(props),
    register: ({ router, method, path, handler }: RegisterProps<Router, RouterOptions>) =>
        (router as any)[method](path, handler),
    build: (router: Router) => router,
};

export const ExpressApplication = (props: AdapterApplicationProps) => (
    <Application {...props} appAdapter={ExpressAdapter} routerAdapter={ExpressRouterAdapter} />
);

type CtxArgs = Parameters<RequestHandler>;
export interface ExpressRequestContext {
    req: CtxArgs[0];
    res: CtxArgs[1];
    next: CtxArgs[2];
}
