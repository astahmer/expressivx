import { ApplicationContextProps } from "./core/Application";
import { RouterContextProps } from "./core/Router";

export interface WithChildren {
    children: React.ReactNode;
}
export type RequestHandler = (...args: any) => void | Promise<void>;
export interface RequestHandlerProps<Context = Record<string, any>, Router = any>
    extends Pick<RouteProps, "context">,
        WithChildren {
    context?: Context;
    router: Router;
}

export interface AppAdapter<App = any> {
    _app: App;
    make: () => App;
    listen: (...args: any) => void | Promise<void>;
    close: () => void | Promise<void>;
    use: (handler: RequestHandler) => void;
    handler: (props: RequestHandlerProps) => RequestHandler;
}

export interface RouterAdapter<
    Router = any,
    MakeProps = any,
    Register extends RegisterProps = RegisterProps,
    Middleware = any
> {
    make: (props: MakeProps) => Router;
    register: (props: Register) => void;
    build: (router: Router) => Middleware;
}

export type Method = "HEAD" | "OPTIONS" | "GET" | "PUT" | "PATCH" | "POST" | "DELETE";

export interface RegisterProps<Router = any, Middleware = any> extends RouteOptions {
    router: Router;
    handler: Middleware;
}

export interface RouteOptions {
    path: string;
    method: Method | Lowercase<Method>;
}
export interface RouteProps<Context extends Record<string, any> = Record<string, any>>
    extends Partial<Pick<RouteOptions, "method">>,
        Pick<RouteOptions, "path">,
        WithChildren {
    context?: Context;
}
export interface RequestContext {}

export interface RequestContextProps
    extends RequestContext,
        Pick<ApplicationContextProps, "appAdapter">,
        Pick<RouterContextProps, "router">,
        Pick<RouteProps, "context">,
        Record<string, any> {}
