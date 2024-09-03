import React from "react";
import { Link } from "react-router-dom";
import './css/header.css'
import LogButton from "./logbutton";
import useAuth from "../hooks/useAuth";


export default function Header() {

    const { auth } = useAuth();


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
            {auth.uid
            ?<div className='header-cart'><Link to={'/profile'}><span class="material-symbols-outlined">shopping_cart</span></Link></div>
            :<></>}
            
        </div>
    )
}