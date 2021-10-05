import Home from "./pages/home/Home";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Messenger from "./pages/messenger/Messenger";

function App() {
    const { user } = useContext(AuthContext);
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    {user ? <Home /> : <Register />}
                </Route>
                <Route exact path="/login">
                    {user ? <Redirect to="/" /> : <Login />}
                </Route>
                <Route exact path="/register">
                    {user ? <Redirect to="/" /> : <Register />}
                </Route>
                <Route exact path="/messenger">
                    {!user ? <Redirect to="/" /> : <Messenger />}
                </Route>
                <Route exact path="/profile/:username">
                    <Profile />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
