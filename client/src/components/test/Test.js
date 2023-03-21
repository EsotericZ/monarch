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

export const Test = () => {
    const cookies = new Cookies();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    let userData = {'name': ''}

    const setData = () => {
        
        try {
            userData = jwt_decode(cookies.get('jwt'));
            let fullName = userData.name.split(' ');
            setName(fullName[0])
            console.log(name)
            setLoading(false)
        } catch {
            userData = {'name': ''};
            setLoading(false)
        }
    }

    useEffect(() => {
        setData();
    })

    return loading ?
        <>
            <h1>Loading</h1>
        </>
        :
        <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
            <CDBSidebar toggled={true}>
                <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>Monarch Metal</CDBSidebarHeader>
                <CDBSidebarContent>
                    <CDBSidebarMenu>
                        <NavLink exact to='/'>
                            <CDBSidebarMenuItem icon="th-large">Home</CDBSidebarMenuItem>
                        </NavLink>
                        <CDBSidebarMenuItem icon="sticky-note">Components</CDBSidebarMenuItem>
                    </CDBSidebarMenu>
                    {name ?
                        <CDBSidebarMenu>
                            <CDBSidebarMenuItem>{name}</CDBSidebarMenuItem>
                            <CDBSidebarMenuItem>Logout</CDBSidebarMenuItem>
                        </CDBSidebarMenu>
                    :
                        <CDBSidebarMenu>
                            <CDBSidebarMenuItem>Login</CDBSidebarMenuItem>
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