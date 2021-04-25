import { ExpressApplication } from "./adapters/express";
import { ExampleRouter } from "./components";
import { render } from "./renderNil";

render(
    <ExpressApplication port={8000}>
        <ExampleRouter />
    </ExpressApplication>
);
