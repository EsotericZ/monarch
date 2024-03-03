import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Sidebar } from '../sidebar/Sidebar';
import { DepartmentCard } from '../../components/DepartmentCard';

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
    
    const [areas, setAreas] = useState([]);
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAreas([
            {
                area: 'Engineering',
                link: '/engineering',
                nest: 0,
                jobs: 0,
                image: 'engineering',
                areaType: 'programming',
            },
            {
                area: 'Machining',
                link: '/machining',
                nest: 0,
                jobs: 0,
                image: 'machining',
                areaType: 'programming',
            },
            {
                area: 'Quality',
                link: '/quality',
                nest: 0,
                jobs: 0,
                image: 'quality',
                areaType: 'programming',
            },
            {
                area: 'Tube Laser',
                link: '/tubelaserprog',
                nest: 0,
                jobs: 0,
                image: 'tlaser',
                areaType: 'programming',
            },
            {
                area: 'Forming',
                link: '/formingprog',
                nest: 0,
                jobs: 0,
                image: 'forming',
                areaType: 'programming',
            },
        ]);
    }, []);

    useEffect(() => {
        setTools([
            {
                area: 'QC Info',
                link: '/qualityinfo',
                image: 'qcInfo',
                areaType: 'tooling',
            },
            {
                area: 'Bend Deduction',
                link: '/benddeduction',
                image: 'bd',
                areaType: 'tooling',
            },
            {
                area: 'Tap Chart',
                link: '/tapchart',
                image: 'tap',
                areaType: 'tooling',
            },
            {
                area: 'Hardware',
                link: '/hardware',
                image: 'hardware',
                areaType: 'tooling',
            },
        ]);
    }, []);

    return (
        // <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Departments</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Programming</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        {areas.map((area, index) => {
                            return (
                                <DepartmentCard key={index} area={area} />
                            )
                        })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        {tools.map((area, index) => {
                            return (
                                <DepartmentCard key={index} area={area} />
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    )
}