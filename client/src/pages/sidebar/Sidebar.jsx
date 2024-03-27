import { useEffect, useState, useLayoutEffect } from 'react';
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

import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

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

    const toggleSidebar = () => {
        setOpen(prevState => !prevState);
    };

    useEffect(() => {
        setData();
    }, [name, admin])

    useLayoutEffect(() => {
        const handleResize = () => {
            setOpen(false);
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return !loading &&
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'fixed' }}>
            <CDBSidebar toggled={open}>
                <CDBSidebarHeader prefix={<i className="fa fa-bars" onClick={toggleSidebar} />}>Monarch Metal</CDBSidebarHeader>
                <CDBSidebarContent>
                    <CDBSidebarMenu>

                        {open ?
                            <OverlayTrigger
                                placement="right"
                                overlay={<Tooltip id="button-tooltip-2">Home</Tooltip>}
                            >
                                <NavLink exact to='/'>
                                    <CDBSidebarMenuItem icon="home">Home</CDBSidebarMenuItem>
                                </NavLink>
                            </OverlayTrigger>
                        :
                            <CDBSidebarSubMenu title="Home" icon="home">
                                {/* <Link to='/http://10.0.1.78/monarch_jobdisplay'> */}
                                    <CDBSidebarMenuItem>Display List</CDBSidebarMenuItem>
                                {/* </Link> */}
                                <CDBSidebarMenuItem>Directory</CDBSidebarMenuItem>
                                <NavLink exact to='/purchasing'>
                                    <CDBSidebarMenuItem>Purchasing</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/supplies'>
                                    <CDBSidebarMenuItem>Supplies</CDBSidebarMenuItem>
                                </NavLink>
                            </CDBSidebarSubMenu>
                        }

                        {open ?
                            <OverlayTrigger
                                placement="right"
                                overlay={<Tooltip id="button-tooltip-2">Programming</Tooltip>}
                            >
                                <NavLink exact to='/programming'>
                                    <CDBSidebarMenuItem icon='ghost'>Programming</CDBSidebarMenuItem>
                                </NavLink>
                            </OverlayTrigger>
                        :
                            <CDBSidebarSubMenu title="Programming" icon="ghost">
                                <NavLink exact to='/engineering'>
                                    <CDBSidebarMenuItem>Engineering</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/quality'>
                                    <CDBSidebarMenuItem>Quality</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/formingprog'>
                                    <CDBSidebarMenuItem>Forming</CDBSidebarMenuItem>
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
                                <NavLink exact to='/tapchart'>
                                    <CDBSidebarMenuItem>Tap Chart</CDBSidebarMenuItem>
                                </NavLink>
                            </CDBSidebarSubMenu>
                        }

                        {open ?
                            <OverlayTrigger
                                placement="right"
                                overlay={<Tooltip id="button-tooltip-2">Departments</Tooltip>}
                            >
                                <NavLink exact to='/departments'>
                                    <CDBSidebarMenuItem icon='th'>Departments</CDBSidebarMenuItem>
                                </NavLink>
                            </OverlayTrigger>
                        :
                            <CDBSidebarSubMenu title="Departments" icon="th">
                                <NavLink exact to='/fixturelaser'>
                                <CDBSidebarMenuItem>Fixture Laser</CDBSidebarMenuItem>
                                </NavLink>
                                <CDBSidebarMenuItem>Laser (Enterprise)</CDBSidebarMenuItem>
                                <NavLink exact to='/punch'>
                                    <CDBSidebarMenuItem>Punch</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/saw'>
                                    <CDBSidebarMenuItem>Saw</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/shear'>
                                    <CDBSidebarMenuItem>Shear</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/staticlaser'>
                                    <CDBSidebarMenuItem>Static Laser</CDBSidebarMenuItem>
                                </NavLink>
                                <NavLink exact to='/tubelaser'>
                                    <CDBSidebarMenuItem>Tube Laser</CDBSidebarMenuItem>
                                </NavLink>
                                <CDBSidebarMenuItem>Tube Laser (Material)</CDBSidebarMenuItem>
                            </CDBSidebarSubMenu>
                        }

                        <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip id="button-tooltip-2">Maintenance</Tooltip>}
                        >
                            <NavLink exact to='/maintenance'>
                                <CDBSidebarMenuItem icon="hammer">Maintenance</CDBSidebarMenuItem>
                            </NavLink>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip id="button-tooltip-2">Shipping</Tooltip>}
                        >
                            <NavLink exact to='/shipping'>
                                <CDBSidebarMenuItem icon='truck'>Shipping</CDBSidebarMenuItem>
                            </NavLink>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip id="button-tooltip-2">Inventory</Tooltip>}
                        >
                            <NavLink exact to='/inventory'>
                                <CDBSidebarMenuItem icon='clipboard'>Inventory</CDBSidebarMenuItem>
                            </NavLink>
                        </OverlayTrigger>
                    </CDBSidebarMenu>

                    {name ?
                        <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip id="button-tooltip-2">Profile</Tooltip>}
                        >
                            <CDBSidebarMenu>
                                <NavLink exact to='/profile'>
                                    <CDBSidebarMenuItem icon="user">Profile</CDBSidebarMenuItem>
                                </NavLink>
                            </CDBSidebarMenu>
                        </OverlayTrigger>
                    :
                        <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip id="button-tooltip-2">Login</Tooltip>}
                        >
                            <CDBSidebarMenu>
                                <NavLink exact to='/login'>
                                    <CDBSidebarMenuItem icon="user">Login</CDBSidebarMenuItem>
                                </NavLink>
                            </CDBSidebarMenu>
                        </OverlayTrigger>
                    }

                    {admin &&
                        <CDBSidebarMenu>
                            <OverlayTrigger
                                placement="right"
                                overlay={<Tooltip id="button-tooltip-2">Admin</Tooltip>}
                            >
                                <NavLink exact to='/admin'>
                                    <CDBSidebarMenuItem icon="wrench">Admin</CDBSidebarMenuItem>
                                </NavLink>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="right"
                                overlay={<Tooltip id="button-tooltip-2">RFID</Tooltip>}
                            >
                                <a href='http://10.0.1.45:3000/' target='__blank'>
                                    <CDBSidebarMenuItem icon="lock">RFID Site</CDBSidebarMenuItem>
                                </a>
                            </OverlayTrigger>
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