import { useState } from 'react';
import Cookies from 'universal-cookie';

import login from '../../services/portal/login';

export const Login = () => {
    const cookies = new Cookies();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password)
        .then((res) => {
            cookies.set('jwt', res.accessToken)
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input className='input' type='text' placeholder='Username' onChange={(e) => {setUsername(e.target.value)}}></input>
                <input className='input' type='text' placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}></input>
                <button>Login</button>
            </form>
        </>
    )
}