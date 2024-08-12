import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';

function LoadProfile () {

    const {auth} = useAuth();
    
return (
    <>
    <h1>Welcome {auth.user}</h1>
    </>
)

}

export default LoadProfile;

