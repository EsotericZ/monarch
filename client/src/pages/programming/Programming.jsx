import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Sidebar } from '../sidebar/Sidebar';
import { DepartmentCard } from '../../components/DepartmentCard';

import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getMachTBRJobs from '../../services/machining/getMachTBRJobs';
import getMachFutureJobs from '../../services/machining/getMachFutureJobs';

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
    
    const [engTBR, setEngTBR] = useState(0);
    const [engFuture, setEngFuture] = useState(0);

    const [machTBR, setMachTBR] = useState(0);
    const [machFuture, setMachFuture] = useState(0);

    const [qualityTBR, setQualityTBR] = useState(0);
    const [qualityFuture, setQualityFuture] = useState(0);

    const [tlaserTBR, setTLaserTBR] = useState(0);
    const [tlaserFuture, setTLaserFuture] = useState(0);

    const [formTBR, setFormTBR] = useState(0);
    const [formFuture, setFormFuture] = useState(0);

    const [areas, setAreas] = useState([]);
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [
                tbrRes, 
                futureRes,
                tbrMachRes, 
                futureMachRes,
            ] = await Promise.all([
                getTBRJobs(),
                getFutureJobs(),
                getMachTBRJobs(),
                getMachFutureJobs(),
            ]);

            let tbrEngCount = tbrRes.filter(row => typeof row.JobNo !== 'undefined').length;
            setEngTBR(tbrEngCount);
            let futureEngCount = futureRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length;
            setEngFuture(futureEngCount);

            let tbrMachCount = tbrMachRes.filter(row => typeof row.JobNo !== 'undefined').length;
            setMachTBR(tbrMachCount);
            let futureMachCount = futureMachRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length;
            setMachFuture(futureMachCount);

            let tbrQualityCount = ((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length);
            setQualityTBR(tbrQualityCount);
            let futureQualityCount = ((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length);
            setQualityFuture(futureQualityCount);

            let tbrTLCount = ((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length);
            setTLaserTBR(tbrTLCount);
            let futureTLCount = ((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'TLASER'))).length);
            setTLaserFuture(futureTLCount);

            let tbrFormCount = ((tbrRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length);
            setFormTBR(tbrFormCount);
            let futureFormCount = ((futureRes.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length);
            setFormFuture(futureFormCount);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        setAreas([
            {
                area: 'Engineering',
                link: '/engineering',
                tbr: engTBR,
                future: engFuture,
                image: 'engineering',
                areaType: 'programming',
            },
            {
                area: 'Machining',
                link: '/machining',
                tbr: machTBR,
                future: machFuture,
                image: 'machining',
                areaType: 'programming',
            },
            {
                area: 'Quality',
                link: '/quality',
                tbr: qualityTBR,
                future: qualityFuture,
                image: 'quality',
                areaType: 'programming',
            },
            {
                area: 'Tube Laser',
                link: '/tubelaserprog',
                tbr: tlaserTBR,
                future: tlaserFuture,
                image: 'tlaser',
                areaType: 'programming',
            },
            {
                area: 'Forming',
                link: '/formingprog',
                tbr: formTBR,
                future: formFuture,
                image: 'forming',
                areaType: 'programming',
            },
        ]);
    }, [formFuture]);

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