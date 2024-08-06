import React from "react"
import { Link } from "react-router-dom";

const Profile = () => {

    return (
        <div className='profile'>
            <h1>Welcome to Profile</h1>
            <Link to={'/home'}>
                <button>Go to Home</button>
            </Link>

        </div>
    )

}

export default Profile;