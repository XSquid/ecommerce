import React from "react"
import RegisterUser from "../api/register_api"

import './css/register.css'



const Register = () => {

    return (
        <div className='register-outer'>
            <div classname='register-break'></div>
            <div className='register-middle'>
                <div className='register-inner-left'>
                    <h2>Register an account with Nailed It</h2>
                </div>
                <div className='register-inner-right'>
                <RegisterUser />

                </div>
            </div>
        </div>
    )

}

export default Register;