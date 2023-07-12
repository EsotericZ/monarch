import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import './profile.css';

import { Sidebar } from '../sidebar/Sidebar';

export const Profile = () => {
    const cookies = new Cookies();
    const [name, setName] = useState('');
    const [admin, setAdmin] = useState(false);
    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogout = () => {
        cookies.remove('jwt', { path: '/', domain:'' });
        setName('');
        setAdmin(false);
        setLoggedIn(false);
    }

    useEffect(() => {
        try {
            setCookieData(jwt_decode(cookies.get('jwt')));
            setLoggedIn(true)
        } catch {
            setCookieData('');
        }
    }, [loggedIn])

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                <h1>Monarch Metal</h1>
                {loggedIn ?
                    <>
                        <h2>Signed in as {cookieData.name}</h2>
                        <NavLink exact to='/'>
                            <h2 onClick={handleLogout}>Logout</h2>
                        </NavLink>
                    </>
                :
                    <h2>Log In</h2>
                }
            </div>
        </div>
    )
}