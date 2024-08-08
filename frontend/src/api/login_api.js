import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';


function LoginUser() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/login/password/',{
            username,
            password
        }).then(res => {
            if (res.data) {
                console.log(res.data)
                navigate(`/profile/`)
            } 
        })
        .catch(error => console.log(error))

        // const response = await fetch('http://localhost:3000/login/password', {
        //     method: 'POST',
        //     redirect: "follow",
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         username,
        //         password
        //     })
        // })  
        // console.log(response);


    }

    return (
        <div>
            <form>
                <div>
                    <label for="username">Username</label><br />
                    <input id="username" name="username" type="text" autocomplete="username" onChange={event => setUsername(event.target.value)} required />
                </div>
                <div>
                    <label for="password">Password</label><br />
                    <input id="password" name="password" type="password" autocomplete="password"  onChange={event => setPassword(event.target.value)} required />
                </div>
                <button type="submit" onClick={handleSubmit}>Login</button>
            </form>
        </div>
    )
}

export default LoginUser;