import { CircularProgress } from "@mui/material";
import React, { useContext, useRef } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

function Login() {
    // useRef
    const email = useRef();
    const password = useRef();

    // useContext
    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    // Function
    const handleClick = (e) => {
        e.preventDefault();
        loginCall(
            { email: email.current.value, password: password.current.value },
            dispatch
        );
    };
    console.log(user);
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Lamasocial</h3>
                    <span className="loginDesc">
                        Connecct with friends and the world around you on
                        Lamasocial.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input
                            type="email"
                            placeholder="Email"
                            className="loginInput"
                            ref={email}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="loginInput"
                            ref={password}
                            required
                            minLength="6"
                        />
                        <button
                            className="loginButton"
                            disabled={isFetching}
                            type="submit"
                        >
                            {isFetching ? <CircularProgress /> : "Log in"}
                        </button>
                        <span className="loginForgot">Forgot Password?</span>
                        <button className="loginRegisterButton">
                            {isFetching ? (
                                <CircularProgress />
                            ) : (
                                "Create a New Account"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
