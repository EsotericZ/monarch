import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

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
        <>
            {userData.name ?
                <h1>User Info / Access</h1>
            :
                <>
                    <h1>You don't have access to this page, please sign in</h1>
                    <a href='/'>Home</a>
                </>
            }
        </>
    )
}