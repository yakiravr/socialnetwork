import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./ResetPassword";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1></h1>
            <div id="app-logo">
                <img id="logo" src="icon.png" />
            </div>

            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/verification" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
