import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import { Sidebar } from '../sidebar/Sidebar';

export const Home = () => {
    const cookies = new Cookies();

    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

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
                <h1 className='text-center m-3'>Monarch Metal</h1>
                {cookieData ?
                    <h5 className='text-center m-3'>User: {cookieData.name}</h5>
                :
                    <div className='text-center m-3'>
                        <NavLink exact to='/login'>Login</NavLink>
                    </div>
                }
            </div>
        </div>
    )
}