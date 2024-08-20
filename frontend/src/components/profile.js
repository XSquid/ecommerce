import React from "react"
import LoadProfile from "../api/profile_api";
import "./css/profile.css"

const Profile = () => {

    return (
        <div className='profile'>
            <LoadProfile />
        </div>
    )

}

export default Profile;