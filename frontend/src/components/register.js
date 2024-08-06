import React from "react"

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
                    <div id='registration-form'>
                        <form action="/register/create" method="post">
                            <div>
                                <label for="username">Username</label><br />
                                <input id="username" name="username" type="text" autocomplete="username" required />
                            </div>
                            <div>
                                <label for="current-password">Password</label><br />
                                <input id="current-password" name="password" type="password" autocomplete="current-password" required />
                            </div>
                            <div>
                                <label for="address">Address</label><br />
                                <input id="address" name="address" type="text" autocomplete="address" required />
                            </div>
                            <div>
                                <label for="email">Email</label><br />
                                <input id="email" name="email" type="text" autocomplete="email" required />
                            </div>
                            <div>
                                <button type="submit">Register</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )

}

export default Register;