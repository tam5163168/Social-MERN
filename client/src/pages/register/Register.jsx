import axios from "axios";
import React, { useRef } from "react";
import "./register.css";
import { useHistory } from "react-router";

function Register() {
    // useRef()
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const history = useHistory();

    // Function
    const handleClick = async (e) => {
        e.preventDefault();

        if (passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Password not match");
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            };
            try {
                await axios.post("/auth/register", user);
                history.push("/login");
            } catch (error) {
                console.log(error);
            }
        }
    };
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
                    <form className="loginBox" onClick={handleClick}>
                        <input
                            type="text"
                            placeholder="Username"
                            className="loginInput"
                            ref={username}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            ref={email}
                            className="loginInput"
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
                        <input
                            type="password"
                            placeholder="Password Again"
                            className="loginInput"
                            ref={passwordAgain}
                            required
                        />
                        <button className="loginButton" type="submit">
                            Sign up
                        </button>
                        <button className="loginRegisterButton">
                            Log into Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
