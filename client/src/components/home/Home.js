import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import login from '../../services/portal/login';
import { Sidebar } from '../sidebar/Sidebar';

export const Home = () => {
    const cookies = new Cookies();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cookieData1, setCookieData1] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password)
        .then((res) => {
            cookies.set('jwt', res.accessToken)
            setCookieData1(jwt_decode(cookies.get('jwt')))
            setLoggedIn(true)
        })
    }

    const handleLogout = () => {
        setCookieData1('')
        setLoggedIn(false)
        cookies.remove('jwt', { path: '/' })
    }

    useEffect(() => {
        try {
            setCookieData1(jwt_decode(cookies.get('jwt')));
        } catch {
            setCookieData1('');
        }
    }, [loggedIn])

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                <h1>Monarch Metal</h1>
                {cookieData1 ?
                    <h2>Signed in as {cookieData1.name}</h2>
                    
                :
                    <form onSubmit={handleSubmit}>
                        <input className='input' type='text' placeholder='Username' onChange={(e) => {setUsername(e.target.value)}}></input>
                        <input className='input' type='text' placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}></input>
                        <button>Login</button>
                    </form>
                }
            </div>
        </div>
    )
}