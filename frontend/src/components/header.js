import React from "react";
import { Link } from "react-router-dom";
import './css/header.css'
import LogButton from "./logbutton";


export default function Header() {
    return (
        <div className='header'>
            <h1>Nailed It Hammerstore</h1>
            <div className='navbar'>
                <Link to={'/home'}><button className='header-btn'>Home</button></Link>
                <Link to={'/register'}><button className='header-btn'>Register</button></Link>
                <Link to={'/profile'}><button className='header-btn'>Profile</button></Link>
                <Link to={'/products'}><button className='header-btn'>Products</button></Link>
                <span><LogButton /></span>

            </div>
        </div>
    )
}