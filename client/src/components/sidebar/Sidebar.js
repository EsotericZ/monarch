import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { NavLink } from 'react-router-dom';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
  CDBSidebarSubMenu,
  CDBSidebarFooter,
} from 'cdbreact-pro';

export const Sidebar = () => {
    const cookies = new Cookies();
    const [name, setName] = useState('');
    const [admin, setAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    let userData

    const setData = () => {
        try {
            userData = (jwt_decode(cookies.get('jwt')))
            setName(userData.name.split(' ')[0]);
            userData.role == 'admin' && setAdmin(true);
            setLoading(false)
        } catch {
            setLoading(false)
        }
    }

    useEffect(() => {
        setData();
    }, [name, admin])

    return !loading &&
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'fixed' }}>
            <CDBSidebar toggled={true}>
                <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>Monarch Metal</CDBSidebarHeader>
                <CDBSidebarContent>
                    <CDBSidebarMenu>
                        <NavLink exact to='/'>
                            <CDBSidebarMenuItem icon="home">Home</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to='/maintenance'>
                            <CDBSidebarMenuItem icon="th-large">Maintenance</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to='/shipping'>
                            <CDBSidebarMenuItem icon='truck'>Shipping</CDBSidebarMenuItem>
                        </NavLink>
                    </CDBSidebarMenu>
                    {name ?
                        <CDBSidebarMenu>
                            <NavLink exact to='/profile'>
                                <CDBSidebarMenuItem icon="user">Profile</CDBSidebarMenuItem>
                            </NavLink>
                        </CDBSidebarMenu>
                    :
                        <CDBSidebarMenu>
                            <NavLink exact to='/login'>
                                <CDBSidebarMenuItem icon="user">Login</CDBSidebarMenuItem>
                            </NavLink>
                        </CDBSidebarMenu>
                    }
                    {admin &&
                        <CDBSidebarMenu>
                            <NavLink exact to='/admin'>
                                <CDBSidebarMenuItem icon="wrench">Admin</CDBSidebarMenuItem>
                            </NavLink>
                            <a href='http://10.0.1.45:3000/' target='__blank'>
                                <CDBSidebarMenuItem icon="lock">RFID Site</CDBSidebarMenuItem>
                            </a>
                        </CDBSidebarMenu>
                    }

                </CDBSidebarContent>

                <CDBSidebarFooter style={{ textAlign: 'center' }}>
                    {name ?
                        <div className="sidebar-btn-wrapper" style={{padding: '20px 5px'}}>
                            {name}
                        </div>
                    :
                        <div className="sidebar-btn-wrapper" style={{padding: '20px 5px'}}>
                            Guest
                        </div>
                    }
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
}