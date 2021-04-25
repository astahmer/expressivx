import React, { Fragment, ReactNode, useEffect, useRef, useState } from "react";

import { ExpressRequestContext, ExpressRequestHandler } from "../adapters/express";
import { useAppContext } from "../core/Application";
import { Route, useRequestContext } from "../core/Route";
import { Router } from "../core/Router";
import { RequestHandler, RouteProps, WithChildren } from "../types";
import { Home } from "./Home";

export const ExampleRouter = () => (
    <Router>
        <Route path="/">
            <RouteList />
        </Route>
        <Route path="/auth-hook">
            <ResponseWithAuthHook />
        </Route>
        <Route path="/auth-wrapper">
            <AuthMiddleware fallback={"Unauthorized from wrapper"}>Auth-wrapper: OK</AuthMiddleware>
        </Route>
        {/* <RerenderExampleWrapper>
            <Route path="/counter">
                <ResponseWithDynamicCounter />
            </Route>
        </RerenderExampleWrapper> */}
        <Route path="/string">string</Route>
        <Route path="/obj">{{ abc: 123 }}</Route>
        <Route path="/arr">{[1, 2, { zzz: 777 }]}</Route>
        <Route path="/null">{null}</Route>
        <Route path="/jsx">
            <span>span</span>
            <div>div</div>
            <>fragment</>
        </Route>
        <Route path="/fn">{({ req }: ExpressRequestContext) => req.ip}</Route>
        <Route path="/:fallback">{({ req }: ExpressRequestContext) => req.params.fallback}</Route>
        <Route path="/" method="POST">
            <Home>
                <pre>{({ req }: ExpressRequestContext) => JSON.stringify(req.body, null, 4)}</pre>
            </Home>
        </Route>
    </Router>
);

const RerenderExampleWrapper = ({ children }: WithChildren) => {
    const ctx = useAppContext();
    const onRerender = ctx.onRerender;

    const [count, setCount] = useState(0);
    const countRef = useRef(0);
    console.log("render", count, countRef);
    console.log("app.state", ctx.state.current);
    ctx.state.current.count = count;

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("useEffect", count, countRef);
            countRef.current++;
            ctx.state.current.countRef = countRef;
            setCount((count) => count + 1);
            onRerender();
            // clearInterval(interval);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // return <Fragment key={count}>{children}</Fragment>;
    return <>{children}</>;
};

const ResponseWithDynamicCounter = () => {
    const ctx = useRequestContext();
    const count = ctx.context.current?.count;
    const countRef = ctx.context.current?.countRef?.current;
    console.log({ count, countRef });

    return (
        <>
            <div>count: {count}</div>
            <div>countRef: {countRef}</div>
        </>
    );
};

const AuthMiddleware = ({ children, fallback }: WithChildren & { fallback: ReactNode }) => {
    const ctx = useRequestContext<ExpressRequestContext>();
    console.log(ctx.req.query);
    if (ctx.req.query.auth === "ok") {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

const ResponseWithAuthHook = () => {
    try {
        useAuth();
    } catch (error) {
        return <div>Unauthorized from hook</div>;
    }

    // Can still use hooks after the try-catch
    useMiddleware((req) => console.log(req.query));

    return <div>OK</div>;
};

const useMiddleware = (mw: ExpressRequestHandler) => {
    const ctx = useRequestContext<ExpressRequestContext>();
    return mw(ctx.req, ctx.res, ctx.next);
};
const useAuth = () =>
    useMiddleware((req, res) => {
        if (req.query.auth === "ok") return;
        res.status(401);
        throw new Error("Forbidden");
    });

const RouteList = () => {
    console.log("RouteList");
    const ctx = useRequestContext();
    const router = ctx.router;
    const keys = (router || []).stack.map((item: any) => item.route);

    return (
        <>
            <ul>
                {[...keys].map((key) => (
                    <li key={key.path}>
                        {Object.keys(key.methods).join(",")} {key.path}
                    </li>
                ))}
            </ul>
        </>
    );
};

type RoutePropsWithoutMethod = Omit<RouteProps, "method">;
export const Get = (props: RoutePropsWithoutMethod) => <Route {...props} method="GET" />;
export const Post = (props: RoutePropsWithoutMethod) => <Route {...props} method="POST" />;
export const Put = (props: RoutePropsWithoutMethod) => <Route {...props} method="PUT" />;
export const Delete = (props: RoutePropsWithoutMethod) => <Route {...props} method="DELETE" />;

{
    /* <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch> */
}
