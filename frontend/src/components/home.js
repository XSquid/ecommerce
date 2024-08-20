import React from "react"
import { Link } from "react-router-dom";
import "./css/home.css"

const Home = () => {

    return (
        <div className='homepage'>
            <div className='homepage-links'>
                <Link to={'/login'}>
                    <button>Go to login</button>
                </Link><br />
                <Link to={'/register'}>
                    <button>Create an account</button>
                </Link>
            </div>
            <div className='homepage-about'>
                <h1>Welcome to Nailed It Hammerstore!</h1>
                <h2>About This Page</h2>
                <p>This is full stack project page made with the intent to practice web development, including the creation of a database, back end server and front end website. If the website is unresponsive it is due to the back end server being down, so no calls to it are successful.</p>
                <p>Information for registration is saved on the database with a salted and hashed password for security, meaning it is stored as a long string of random numbers and letters. When registering an account an active email is not needed, a fake email can be used.</p>
                <p>Information regarding the descriptions of tools was found on <a href="https://specopstools.com/blog/a-guide-to-the-different-types-of-hammers-and-how-to-use-them/" target="_blank" rel="noopener noreferrer">specopstools</a> and <a href="https://www.redboxtools.com/news/types-of-hammers-and-uses/" target="_blank" rel="noopener noreferrer">redboxtools</a>. Prices and quantities were randomly made up.</p>
            </div>




        </div>
    )

}

export default Home;