import { useEffect, useState } from 'react';
import { Button, Tab, Tabs, Table } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/entypo/check';
import { refresh } from 'react-icons-kit/fa/refresh';

import getAllMaterials from '../../services/material/getAllMaterials';

import updateNeed from '../../services/material/updateNeed';
import updateOnOrder from '../../services/material/updateOnOrder';
import updateVerified from '../../services/material/updateVerified';

import { Sidebar } from '../sidebar/Sidebar';
// import './departments.css';

export const Purchasing = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'tlaser': false,
        };
    }

    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
    const [searchedValueMaterial, setSearchedValueMaterial] = useState('');
    const [searchedValueProgramNo, setSearchedValueProgramNo] = useState('');
    const [update, setUpdate] = useState('');
    
    const [searchedPrograms, setSearchedPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    const [lasers, setLasers] = useState('');
    const [saws, setSaws] = useState('Saw / Tube Laser');
    const [punch, setPunch] = useState('Shear / Punch');

    const fetchData = async () => {
        try {
            const [allMaterials] = await Promise.all([
                getAllMaterials()
            ]);
    
            setSearchedPrograms(allMaterials.data);

            let laserCount = allMaterials.data.filter(row => row.area == 'laser' || row.area == 'flaser' || row.area == 'slaser').length;
            setLasers(laserCount > 0 ? `Lasers (${laserCount})` : 'Lasers');

            let sawCount = allMaterials.data.filter(row => row.area == 'saw' || row.area == 'tlaser').length;
            setSaws(sawCount > 0 ? `Saw / Tube Laser (${sawCount})` : 'Saw / Tube Laser');

            let punchCount = allMaterials.data.filter(row => row.area == 'punch' || row.area == 'shear').length;
            setPunch(punchCount > 0 ? `Shear / Punch (${punchCount})` : 'Shear / Punch');


            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleNeed = async (job) => {
        try {
            await updateNeed(job.id)
            setUpdate(`Need Matl ${job.id}`)
        } catch (err) {
            console.log(err);
        }
    }

    const toggleOnOrder = async (job) => {
        try {
            await updateOnOrder(job.id)
            setUpdate(`On Order ${job.id}`)
        } catch (err) {
            console.log(err);
        }
    }

    const toggleVerified = async (job) => {
        try {
            await updateVerified(job.id)
            setUpdate(`Verified ${job.id}`)
        } catch (err) {
            console.log(err);
        }
    }
    
    useEffect(() => {
        fetchData();
    }, [loading, update]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Purchasing</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Purchasing</h1>

                    <Tabs
                        defaultActiveKey="lasers"
                        id="justify-tab-example"
                        className='mb-3'
                        justify
                    >

                        <Tab eventKey="lasers" title={lasers}>
                            <div className='mx-3'>
                            <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueProgramNo(e.target.value)} placeholder='&#xf002;  Program No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueMaterial(e.target.value)} placeholder='&#xf002;  Material' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'>Area</th>
                                            <th className='text-center'>Need</th>
                                            <th className='text-center'>On Order</th>
                                            <th className='text-center'>Verified</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedPrograms
                                            .filter((row) => 
                                                !searchedValueProgramNo || row.programNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueProgramNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueMaterial || row.material
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueMaterial.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueJobNo || row.jobNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueJobNo.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                if (job.area == 'laser' || job.area == 'slaser' || job.area == 'flaser') {
                                                    return (
                                                        <tr key={index} job={job}>
                                                            <td className='text-center jobBold'>{job.programNo}</td>
                                                            <td className='text-center'>{job.material}</td>
                                                            <td className='text-center'>{job.jobNo}</td>
                                                            {job.area == 'laser' &&
                                                                <td className='text-center'>Enterprise</td>
                                                            }
                                                            {job.area == 'flaser' &&
                                                                <td classNfme='text-center'>Fixture Laser</td>
                                                            }
                                                            {job.area == 'slaser' &&
                                                                <td className='text-center'>Static Laser</td>
                                                            }
                                                            <td className='text-center' onClick={() => toggleNeed(job)}>
                                                                {job.needMatl &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                            <td className='text-center' onClick={() => toggleOnOrder(job)}>
                                                                {job.onOrder &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                            <td className='text-center' onClick={() => toggleVerified(job)}>
                                                                {job.verified &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                            </div>
                        </Tab>

                        <Tab eventKey="saws" title={saws}>
                            <div className='mx-3'>
                            <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueProgramNo(e.target.value)} placeholder='&#xf002;  Program No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueMaterial(e.target.value)} placeholder='&#xf002;  Material' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'>Area</th>
                                            <th className='text-center'>Need</th>
                                            <th className='text-center'>On Order</th>
                                            <th className='text-center'>Verified</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedPrograms
                                            .filter((row) => 
                                                !searchedValueProgramNo || row.programNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueProgramNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueMaterial || row.material
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueMaterial.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueJobNo || row.jobNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueJobNo.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                if (job.area == 'saw' || job.area == 'tlaser') {
                                                    return (
                                                        <tr key={index} job={job}>
                                                            <td className='text-center jobBold'>{job.programNo}</td>
                                                            <td className='text-center'>{job.material}</td>
                                                            <td className='text-center'>{job.jobNo}</td>
                                                            {job.area == 'tlaser' &&
                                                                <td className='text-center'>Tube Laser</td>
                                                            }
                                                            {job.area == 'saw' &&
                                                                <td className='text-center'>Saw</td>
                                                            }
                                                            <td className='text-center' onClick={() => toggleNeed(job)}>
                                                                {job.needMatl &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                            <td className='text-center' onClick={() => toggleOnOrder(job)}>
                                                                {job.onOrder &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                            <td className='text-center' onClick={() => toggleVerified(job)}>
                                                                {job.verified &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                            </div>
                        </Tab>

                        <Tab eventKey="punch" title={punch}>
                            <div className='mx-3'>
                            <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueProgramNo(e.target.value)} placeholder='&#xf002;  Program No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueMaterial(e.target.value)} placeholder='&#xf002;  Material' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'>Area</th>
                                            <th className='text-center'>Need</th>
                                            <th className='text-center'>On Order</th>
                                            <th className='text-center'>Verified</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedPrograms
                                            .filter((row) => 
                                                !searchedValueProgramNo || row.programNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueProgramNo.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueMaterial || row.material
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueMaterial.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueJobNo || row.jobNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueJobNo.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                if (job.area == 'shear' || job.area == 'punch') {
                                                    return (
                                                        <tr key={index} job={job}>
                                                            <td className='text-center jobBold'>{job.programNo}</td>
                                                            <td className='text-center'>{job.material}</td>
                                                            <td className='text-center'>{job.jobNo}</td>
                                                            {job.area == 'shear' &&
                                                                <td className='text-center'>Shear</td>
                                                            }
                                                            {job.area == 'punch' &&
                                                                <td className='text-center'>Punch</td>
                                                            }
                                                            <td className='text-center' onClick={() => toggleNeed(job)}>
                                                                {job.needMatl &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                            <td className='text-center' onClick={() => toggleOnOrder(job)}>
                                                                {job.onOrder &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                            <td className='text-center' onClick={() => toggleVerified(job)}>
                                                                {job.verified &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                            </div>
                        </Tab>

                    </Tabs>
                </div>
            }
        </div>
    )
}