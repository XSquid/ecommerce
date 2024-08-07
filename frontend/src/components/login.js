import React from "react";
import { Link } from "react-router-dom";
import "./css/login.css"
import LoginUser from "../api/login_api";


const Login = () => {
    return (
        <div className='login-outer'>
            <div classname='login-break'></div>
            <div className='login-middle'>
                <div className='login-inner-left'>
                    <h2>Welcome back to Nailed It</h2>
                    <p>Don't have an account? <Link to="/register">Register!</Link></p>
                </div>
                <div className='login-inner-right'>
                <LoginUser />

                </div>
            </div>
        </div>

    )
}

export default Login;
