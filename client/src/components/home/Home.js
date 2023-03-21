import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

// import { Login } from '../login/Login';
import login from '../../services/portal/login';

export const Home = () => {
    const cookies = new Cookies();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password)
        .then((res) => {
            cookies.set('jwt', res.accessToken)
            setUserData(jwt_decode(cookies.get('jwt')))
        })
    }

    const handleLogout = () => {
        cookies.remove('jwt', { path: '/' });
        setUserData('');
    }

    useEffect(() => {
        try {
            setUserData(jwt_decode(cookies.get('jwt')));
        } catch {
            setUserData('');
        }
    }, [userData])

    return (
        <>
            <h1>Monarch Metal</h1>
            {userData ?
                <h2>Signed in as {userData.name}</h2>
                
            :
                <form onSubmit={handleSubmit}>
                    <input className='input' type='text' placeholder='Username' onChange={(e) => {setUsername(e.target.value)}}></input>
                    <input className='input' type='text' placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}></input>
                    <button>Login</button>
                </form>
            }
            <ul>
                <li>
                    <a href='/maintenance'>Maintenance</a>
                </li>
                {userData &&
                    <li>
                        <a onClick={() => handleLogout()}>Logout</a>
                    </li>
                }
                {(userData.role == 'admin') && 
                    <li>
                        <a href='/admin'>Admin Page</a>
                    </li>
                }
            </ul>
        </>
    )
}