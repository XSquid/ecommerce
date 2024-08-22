import React, {useEffect} from "react"
import RegisterUser from "../api/register_api"
import useAuth from "../hooks/useAuth"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom";

import './css/register.css'



const Register = () => {

    const {auth} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.user) {
            navigate('/profile')
        }
    })

    return (
        <div className='register-outer'>
            <div classname='register-break'></div>
            <div className='register-middle'>
                <div className='register-inner-left'>
                    <h2>Register an account with Nailed It</h2>
                    <p>Already have an account? <Link to='/login'>Log in!</Link></p>
                </div>
                <div className='register-inner-right'>
                <RegisterUser />

                </div>
            </div>
        </div>
    )

}

export default Register;