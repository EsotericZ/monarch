import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import getAllJobs from '../../services/engineering/getAllJobs';
import { Sidebar } from '../sidebar/Sidebar';

export const Engineering = () => {
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

    const [searchedEng, setSearchedEng] = useState([]);
    const [loading, setLoading] = useState(true);

    const find = () => {
        try {
            let data = getAllJobs();
            data.then((res) => {
                setSearchedEng(res);
                setLoading(false);
            })
        } catch (err) {
            console.log(err)
        }
    };
    
    useEffect(() => {
        find();
    }, [loading]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Engineering</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Engineering</h1>
                    <Link to='/engjobs'><h3 className='text-center'>Active Jobs</h3></Link>                   
                    <Link to='/quality'><h3 className='text-center'>Quality</h3></Link>                   
                    <Link to='/benddeduction'><h3 className='text-center'>Bend Deduction</h3></Link>                   
                    <Link to='/hardware'><h3 className='text-center'>Hardware</h3></Link>                   
                    <Link to='/machining'><h3 className='text-center'>Machining</h3></Link>                   
                    <Link to='/nesting'><h3 className='text-center'>Nesting</h3></Link>                   
                    <Link to='/tapchart'><h3 className='text-center'>Tap Chart</h3></Link>                   
                </div>
            }
        </div>
    )
}