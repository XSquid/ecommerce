import React from "react";
import { Link } from "react-router-dom";
import './css/header.css'

export default function Header() {
    return (
        <div className='header'>
            <h1>Nailed It Hammerstore</h1>
            <div className='navbar'>
                <Link to={'/home'}><button>Home</button></Link>
                <Link to={'/login'}><button>Login</button></Link>
                <Link to={'/register'}><button>Register</button></Link>
                <Link to={'/profile'}><button>Profile</button></Link>
                <Link to={'/products'}><button>Products</button></Link>
            </div>
        </div>
    )
}