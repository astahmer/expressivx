import { createContext, useContext, useEffect, useRef, useState } from "react";

import { AppAdapter, RouterAdapter, WithChildren } from "../types";

const ApplicationContext = createContext<ApplicationContextProps>({} as any);
export const useAppContext = () => useContext(ApplicationContext);
export const useApp = () => useAppContext().appAdapter._app;

export const Application = ({ children, port = 8000, onReady, appAdapter, routerAdapter }: ApplicationProps) => {
    const [_, setKey] = useState(0); // Only used to force a re-render

    const state = useRef({}); // Shared app state
    const app = appAdapter.make();

    // Start listening & close app on unmount
    useEffect(() => {
        onReady?.(app);
        appAdapter.listen({ port });
        console.log(`listening on ${port}`);

        return () => {
            appAdapter.close();
        };
    }, []);

    const ctx = { appAdapter, routerAdapter, state, onRerender: () => setKey((state) => state + 1) };

    return <ApplicationContext.Provider value={ctx}>{children}</ApplicationContext.Provider>;
};

export interface ApplicationProps<App = any> extends WithChildren {
    port?: number;
    onReady?: (app: App) => void;
    appAdapter: AppAdapter<App>;
    routerAdapter: RouterAdapter;
}

export interface ApplicationContextProps<State extends Record<string, any> = Record<string, any>>
    extends Pick<ApplicationProps, "appAdapter" | "routerAdapter"> {
    onRerender: () => void;
    state: State;
}
export interface AdapterApplicationProps extends Omit<ApplicationProps, "appAdapter" | "routerAdapter"> {}
