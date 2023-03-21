import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Sidebar } from '../sidebar/Sidebar';

export const Admin = () => {
    const cookies = new Cookies();
    let userData
    try {
        userData = jwt_decode(cookies.get('jwt'));
    } catch {
        userData = {
            'name': '',
            'role': 'employee',
        };
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {userData.name ?
                <div style={{ display: 'inline' }}>
                    <h1>User Info / Access</h1>
                </div>
            :
                <div style={{ display: 'inline' }}>
                    <h1>You don't have access to this page</h1>
                    <h2>Please sign in</h2>
                </div>
            }
        </div>
    )
}