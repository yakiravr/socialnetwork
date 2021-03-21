import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./ResetPassword";

export default function Welcome() {
    return (
        <div id="welcome">
            <div>
                <h1 id="OVERDRAMA">OVERDRAMA</h1>
            </div>
            <div id="titel">
                <h5>A social network for people who live drama</h5>
            </div>
            <div id="panic">
                p <br></br> <br></br>A <br></br> <br></br>N <br></br>
                <br></br> I <br></br>
                <br></br> C <br></br>
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
