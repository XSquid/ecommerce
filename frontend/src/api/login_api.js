import React, { useState } from 'react';
import axios from './axios';
import { useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';


function LoginUser() {

    const { setAuth } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('')

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/login/password', {
                username,
                password
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
            );
            console.log(response)
            setUsername('');
            setPassword('')
            const accessToken = response?.data?.accessToken
            const user = response?.data?.userData?.username
            const uid = response?.data?.userData?.user_id
            setAuth({ user, uid, accessToken })
            navigate('/profile')
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response')
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login Failed')
            }
        }
    }

    return (
        <div>
            <form>
                <div>
                    <label for="username">Username</label><br />
                    <input 
                    id="username" 
                    type="text" 
                    onChange={event => setUsername(event.target.value)}
                    value={username} 
                    autoComplete='off'
                    required />
                </div>
                <div>
                    <label for="password">Password</label><br />
                    <input 
                    id="password" 
                    type="password" 
                    onChange={event => setPassword(event.target.value)} 
                    value={password}
                    required />
                </div>
                <button type="submit" onClick={handleSubmit} className="login-btn">Login</button>
            </form>
        </div>
    )
}

export default LoginUser;