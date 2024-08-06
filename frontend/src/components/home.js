import React from "react"
import { Link } from "react-router-dom";

const Home = () => {

    return (
        <div className='homepage'>
            <h1>Welcome to the homepage</h1>
            <Link to={'/login'}>
                <button>Go to login</button>
            </Link>

        </div>
    )

}

export default Home;