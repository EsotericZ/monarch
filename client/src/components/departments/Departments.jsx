import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import getAllJobs from '../../services/engineering/getAllJobs';
import { Sidebar } from '../sidebar/Sidebar';

export const Departments = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'engineering': false,
        };
    }

    const [loading, setLoading] = useState(false);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Departments</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Departments</h1>
                    <Link to='/fixturelaser'><h3 className='text-center'>Fixture Laser</h3></Link>                   
                    <Link to='/punch'><h3 className='text-center'>Punch</h3></Link>                   
                    <Link to='/saw'><h3 className='text-center'>Saw</h3></Link>                   
                    <Link to='/shear'><h3 className='text-center'>Shear</h3></Link>                   
                    <Link to='/staticlaser'><h3 className='text-center'>Static Laser</h3></Link>                   
                    <Link to='/tubelaser'><h3 className='text-center'>Tube Laser</h3></Link>                   
                </div>
            }
        </div>
    )
}