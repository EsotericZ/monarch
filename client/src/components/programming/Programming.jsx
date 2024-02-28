import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import getAllJobs from '../../services/engineering/getAllJobs';
import { Sidebar } from '../sidebar/Sidebar';

export const Programming = () => {
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
                    <h1 className='text-center'>Programming</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Programming</h1>
                    <Link to='/engineering'><h3 className='text-center'>Engineering</h3></Link>                   
                    <Link to='/quality'><h3 className='text-center'>Quality</h3></Link>                   
                    <Link to='/tlaserprog'><h3 className='text-center'>Tube Laser</h3></Link>                   
                    <Link to='/formingprog'><h3 className='text-center'>Forming</h3></Link>                   
                    <Link to='/benddeduction'><h3 className='text-center'>Bend Deduction</h3></Link>                   
                    <Link to='/machining'><h3 className='text-center'>Machining</h3></Link>                   
                    <Link to='/hardware'><h3 className='text-center'>Hardware</h3></Link>                   
                    <Link to='/tapchart'><h3 className='text-center'>Tap Chart</h3></Link>                   
                </div>
            }
        </div>
    )
}