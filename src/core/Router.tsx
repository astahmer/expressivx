import { createContext, useContext, useEffect } from "react";

import { WithChildren } from "../types";
import { useAppContext } from "./Application";

const RouterContext = createContext<RouterContextProps>({} as any);
export const useRouterContext = () => useContext(RouterContext);
export const useRouter = () => useRouterContext().router;

export const Router = ({ children, ...options }: RouterProps) => {
    const { appAdapter, routerAdapter, onRerender } = useAppContext();
    const router = routerAdapter.make(options);
    console.log("Router.render");

    // Register router in parent application
    useEffect(() => {
        console.log("Router.useEffect");
        appAdapter.use(routerAdapter.build(router));
    }, []);

    const ctx = { router, onRerender };
    return <RouterContext.Provider value={ctx}>{children}</RouterContext.Provider>;
};

export interface RouterContextProps<Router = any> {
    router: Router;
    onRerender: () => void;
}
export interface RouterProps extends WithChildren {}
