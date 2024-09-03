import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import './css/header.css'
import axios from "../api/axios";


const LogButton = () => {

    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const logoutHandler = async (e) => {
        e.preventDefault();
        const response = await axios.post('/logout')
        setAuth({})
        navigate('/home')
    }


    return (
        auth?.user
            ?
            <button onClick={logoutHandler} className='header-btn'>Log Out</button>

            :
            <Link to={'/login'}><button className='header-btn'>Login</button></Link>
    )
}

export default LogButton;