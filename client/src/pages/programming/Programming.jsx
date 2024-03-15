import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";

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
                image: 'engineering',
                areaType: 'programming',
            },
            {
                area: 'Machining',
                link: '/machining',
                image: 'machining',
                areaType: 'programming',
            },
            {
                area: 'Quality',
                link: '/quality',
                image: 'quality',
                areaType: 'programming',
            },
            {
                area: 'Tube Laser',
                link: '/tubelaserprog',
                image: 'tlaser',
                areaType: 'programming',
            },
            {
                area: 'Forming',
                link: '/formingprog',
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
        <div style={{ display: 'flex' }}>
            <Sidebar />
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
        </div>
    )
}