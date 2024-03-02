import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import { Sidebar } from '../sidebar/Sidebar';

export const Profile = () => {
    const cookies = new Cookies();
    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogout = () => {
        cookies.remove('jwt', { path: '/', domain:'' });
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
                {loggedIn ?
                    <>
                        <h2 className='text-center m-3'>{cookieData.name}</h2>
                        <NavLink exact to='/'>
                            <div className='text-center'>
                                <button onClick={handleLogout} className='text-center m-3 mmBtn'>Logout</button>
                            </div>
                        </NavLink>
                    </>
                :
                    <>
                        <NavLink exact to='/login'>
                            <div className='text-center'>
                                <button className='m-5 mmBtn'>Log In</button>
                            </div>
                        </NavLink>
                    </>
                }
            </div>
        </div>
    )
}