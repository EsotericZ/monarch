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
    const [open, setOpen] = useState(true);
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

    const sidebarClick = () => {
        if (open == true) {
            setOpen(false)
            console.log('closed')
        } else {
            setOpen(true)
            console.log('open')
        }
    }

    useEffect(() => {
        setData();
    }, [name, admin])

    return !loading &&
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'fixed' }}>
            <CDBSidebar toggled={true}>
                <CDBSidebarHeader prefix={<i className="fa fa-bars" onClick={sidebarClick} />}>Monarch Metal</CDBSidebarHeader>
                <CDBSidebarContent>
                    <CDBSidebarMenu>

                        {open ?
                            <NavLink exact to='/'>
                                <CDBSidebarMenuItem icon="home">Home</CDBSidebarMenuItem>
                            </NavLink>
                        :
                            <CDBSidebarSubMenu title="Home" icon="home">
                                <CDBSidebarMenuItem>Display List</CDBSidebarMenuItem>
                                <CDBSidebarMenuItem>Directory</CDBSidebarMenuItem>
                                <CDBSidebarMenuItem>Purchasing</CDBSidebarMenuItem>
                                <CDBSidebarMenuItem>Supplies</CDBSidebarMenuItem>
                            </CDBSidebarSubMenu>
                        }

                        {open ?
                            <NavLink exact to='/engineering'>
                                <CDBSidebarMenuItem icon='ghost'>Inventory</CDBSidebarMenuItem>
                            </NavLink>
                        :
                            <CDBSidebarSubMenu title="Engineering" icon="ghost">
                                <NavLink exact to='/engjobs'>
                                    <CDBSidebarMenuItem>Jobs</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/benddeduction'>
                                    <CDBSidebarMenuItem>Bend Deduction</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/hardware'>
                                    <CDBSidebarMenuItem>Hardware</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/machining'>
                                    <CDBSidebarMenuItem>Machining</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/nesting'>
                                    <CDBSidebarMenuItem>Nesting</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/tapchart'>
                                    <CDBSidebarMenuItem>Tap Chart</CDBSidebarMenuItem>
                                </NavLink>
                            </CDBSidebarSubMenu>
                        }

                        {open ?
                            <NavLink exact to='/departments'>
                                <CDBSidebarMenuItem icon='th'>Departments</CDBSidebarMenuItem>
                            </NavLink>
                        :
                            <CDBSidebarSubMenu title="Departments" icon="th">
                                <CDBSidebarMenuItem>Fixture Laser</CDBSidebarMenuItem>
                                <CDBSidebarMenuItem>Forming</CDBSidebarMenuItem>
                                <CDBSidebarMenuItem>Laser (Enterprise)</CDBSidebarMenuItem>
                                <CDBSidebarMenuItem>Punch</CDBSidebarMenuItem>
                                <CDBSidebarMenuItem>Saw</CDBSidebarMenuItem>
                                <CDBSidebarMenuItem>Shear</CDBSidebarMenuItem>
                                <CDBSidebarMenuItem>Static Laser</CDBSidebarMenuItem>
                                <CDBSidebarMenuItem>Tube Laser</CDBSidebarMenuItem>
                                <CDBSidebarMenuItem>Tube Laser (Material)</CDBSidebarMenuItem>
                            </CDBSidebarSubMenu>
                        }

                        <NavLink exact to='/maintenance'>
                            <CDBSidebarMenuItem icon="hammer">Maintenance</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to='/shipping'>
                            <CDBSidebarMenuItem icon='truck'>Shipping</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to='/inventory'>
                            <CDBSidebarMenuItem icon='clipboard'>Inventory</CDBSidebarMenuItem>
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