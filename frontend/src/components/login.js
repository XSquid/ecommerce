import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className='login'>
            <h1>This is the login page</h1>
            <Link to={'/home'}>
                <button>Go to Home</button>
            </Link>
        </div>

    )
}

export default Login;
