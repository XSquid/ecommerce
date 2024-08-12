import React, { useState } from 'react';
import axios from './axios';
import { useNavigate } from 'react-router';

function RegisterUser() {

    //set state based on input fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('')

    const navigate = useNavigate();

    //submit to server the input fields to register a new user
    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post('/register/create', {
            username,
            password,
            address,
            email
        }).then(function (response) {
            console.log(response)
            if (response.data === 'Created') {
                navigate('/profile')
            }
        })
        .catch(function (error) {
            console.log(error)
        })
    };

    return (
        //form for registration
        <form>
            <div>
                <label for="username">Username</label><br />
                <input id="username" name="username" type="text" autocomplete="username" onChange={event => setUsername(event.target.value)} required />
            </div>
            <div>
                <label for="password">Password</label><br />
                <input id="password" name="password" type="password" autocomplete="password" onChange={event => setPassword(event.target.value)} required />
            </div>
            <div>
                <label for="address">Address</label><br />
                <input id="address" name="address" type="text" autocomplete="address" onChange={event => setAddress(event.target.value)} required />
            </div>
            <div>
                <label for="email">Email</label><br />
                <input id="email" name="email" type="text" autocomplete="email" onChange={event => setEmail(event.target.value)} required />
            </div>
            <div>
                <button type="submit" onClick={handleSubmit}>Register</button>
            </div>
        </form>
    )

}

export default RegisterUser;
