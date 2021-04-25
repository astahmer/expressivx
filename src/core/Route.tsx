import { createContext, useContext, useEffect } from "react";

import { Method, RequestContextProps, RouteProps } from "../types";
import { useAppContext } from "./Application";
import { useRouter } from "./Router";

export const RequestContext = createContext<RequestContextProps>({} as any);
export const useRequestContext = <T extends unknown>() => useContext<RequestContextProps & T>(RequestContext as any);

export const Route = ({ children, path, method: methodProp = "GET", context: contextProp = {} }: RouteProps): null => {
    const { appAdapter, routerAdapter, onRerender, state } = useAppContext();
    const router = useRouter();
    const method = methodProp.toLowerCase() as Lowercase<Method>;
    console.log("Route.render", path, method);

    // Register current route in parent router instance
    useEffect(() => {
        const context = { ...state, ...contextProp };
        const args = { children, context, router, onRerender };
        const handler = appAdapter.handler(args);
        routerAdapter.register({ router, method, path, handler });
    }, []);

    return null;
};
