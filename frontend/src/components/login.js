import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import "./css/login.css"
import LoginUser from "../api/login_api";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";


const Login = () => {

    const {auth} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.user) {
            navigate('/profile')
        }
    })

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
