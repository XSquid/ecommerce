import React from "react"
import { Link } from "react-router-dom";
import LoadProfile from "../api/profile_api";

const Profile = () => {

    return (
        <div className='profile'>
            <h1>Welcome to Profile</h1>
            <LoadProfile />
            <Link to={'/home'}>
                <button>Go to Home</button>
            </Link>

        </div>
    )

}

export default Profile;