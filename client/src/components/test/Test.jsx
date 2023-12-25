import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import { Admin } from '../admin/Admin';
import { Sidebar } from '../sidebar/Sidebar';

export const Test = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <Admin />
        </div>
    )
}