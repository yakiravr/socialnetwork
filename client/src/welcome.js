import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./ResetPassword";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome</h1>
            <div id="welcome-logo">
                <img src="/logo.png" />
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
