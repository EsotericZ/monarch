import { useState } from 'react';

import login from '../../services/portal/login';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password)
        .then((res) => {
            console.log(res)
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