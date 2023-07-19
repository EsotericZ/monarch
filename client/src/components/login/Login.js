import { useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import './login.css';

import login from '../../services/portal/login';
import { Sidebar } from '../sidebar/Sidebar';

export const Login = () => {
    const cookies = new Cookies();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cookieData, setCookieData] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginFail, setLoginFail] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password)
        .then((res) => {
            cookies.set('jwt', res.accessToken);
            setCookieData(jwt_decode(cookies.get('jwt')));
            setLoggedIn(true);
            window.location.href = '/profile';
        })
        .catch((res) => {
            console.log('fail')
            console.log(res)
            setLoginFail(true)
        })
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                {loggedIn ?
                    <h2>Signed in as {cookieData.name}</h2>
                :
                    <div className="Auth-form-container">
                        <form className="Auth-form" onSubmit={handleSubmit}>
                            <div className="Auth-form-content">
                                <h3 className="Auth-form-title">Sign In</h3>
                                {loginFail ?
                                    <div className="LoginError">Incorrect Username or Password</div>
                                :
                                    <></>
                                }
                                <div className="form-group mt-3">
                                    <label>Username</label>
                                    <input 
                                        className='input form-control mt-1' 
                                        type='text' 
                                        placeholder='Username' 
                                        onChange={(e) => {setUsername(e.target.value)}}
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label>Password</label>
                                    <input 
                                        className='input form-control mt-1' 
                                        type='password' 
                                        placeholder='Password' 
                                        onChange={(e) => {setPassword(e.target.value)}}
                                    />
                                </div>
                                <div className="d-grid gap-2 mt-3">
                                    <button type="submit" className="mmBtnLogin">
                                        Submit
                                    </button>
                                </div>
                                <p className="forgot-password text-right mt-2">
                                    Forgot <a href="#">password?</a>
                                </p>
                            </div>
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}