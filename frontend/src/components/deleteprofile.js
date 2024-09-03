import { useNavigate } from "react-router"
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

export default function DeleteProfile() {
    
    const navigate = useNavigate();
    const {auth, setAuth} = useAuth();

    const noDelete = (e) => {
        navigate('/profile')
    }

    const accountDelete = async () => {
        try {
            const response = await axios.post(`/profile/delete/${auth.uid}`, {},
                {
                headers: { "Authorization": `Bearer ${auth.accessToken}` } //Set authorization header with access token in order to verify login with JWT on backend
            })
            setAuth({})
            navigate('/home')
            
        } catch (err) {
            console.log(err)
        }
    }

        return (
            <div className='profile-delete'>
                <h1>Delete profile {auth.uid}</h1>
                <h2>{auth.accessToken}</h2>
                <p>Are you sure? All information will be removed.</p>
                <button onClick={accountDelete}>Yes</button>
                <button onClick={noDelete}>No</button>
            </div>
        )
}