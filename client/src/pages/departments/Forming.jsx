import { useEffect, useState } from 'react';
import { Button, Modal, Table, Toast, ToastContainer } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/entypo/check';
import { refresh } from 'react-icons-kit/fa/refresh';

import getAllJobs from '../../services/forming/getAllJobs';
import updateComplete from '../../services/material/updateComplete';

import { Sidebar } from '../sidebar/Sidebar';
import './departments.css';

export const Forming = () => {
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
    const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueType, setSearchedValueType] = useState('');
    const [searchedValueTooling, setSearchedValueTooling] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');
    const [jobProgramNo, setJobProgramNo] = useState('None');
    const [jobId, setJobId] = useState(0);
    const [update, setUpdate] = useState('');

    const [searchedForming, setSearchedForming] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [showComplete, setShowComplete] = useState(false);

    const fetchData = async () => {
        try {
            const [allJobs] = await Promise.all([
                getAllJobs(),
            ]);
    
            setSearchedForming(allJobs);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCloseComplete = () => setShowComplete(false);

    const toggleComplete = async () => {
        setShowComplete(false);
        try {
            await updateComplete(jobId)
            setUpdate(`Complete ${jobId}`)
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchData();
    }, [loading, show, update]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Forming</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Forming</h1>

                    <Modal show={showComplete} onHide={handleCloseComplete}>
                        <Modal.Body className="text-center">
                            <Modal.Title>Complete Program {jobProgramNo}</Modal.Title>
                            <div className="mt-3">
                                <Button className='modalBtnCancel' variant="secondary" onClick={handleCloseComplete}>
                                    Cancel
                                </Button>
                                <Button className='modalBtnVerify' variant="primary" onClick={toggleComplete}>
                                    Verify
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <div className='mx-3'>
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th className='text-center'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                    <th className='text-center'>Step No</th>
                                    <th className='text-center'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                    <th className='text-center'>Revision</th>
                                    <th className='text-center'>Qty</th>
                                    <th className='text-center'>Due Date</th>
                                    <th className='text-center'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                    <th className='text-center'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                    <th className='text-center'>S2</th>
                                    <th className='text-center'>S3</th>
                                    <th className='text-center'>AP</th>
                                    <th className='text-center'><input onChange={(e) => setSearchedValueTooling(e.target.value)} placeholder='&#xf002;  Tooling' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedForming
                                    .filter(row => typeof row.JobNo !== 'undefined')
                                    .filter((row) => 
                                        !searchedValueJobNo || row.JobNo
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValueJobNo.toString().toLowerCase())
                                    )
                                    .filter((row) => 
                                        !searchedValuePartNo || row.PartNo
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValuePartNo.toString().toLowerCase())
                                    )
                                    .filter((row) => 
                                        !searchedValueCustomer || row.CustCode
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValueCustomer.toString().toLowerCase())
                                    )
                                    .filter((row) => 
                                        !searchedValueType || row.User_Text3
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValueType.toString().toLowerCase())
                                    )
                                    .filter((row) => 
                                        !searchedValueTooling || row.Descrip
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValueTooling.toString().toLowerCase())
                                    )
                                    .map((job, index) => {
                                        return (
                                            <tr key={index} job={job}>
                                                <td className='text-center jobBold'>{job.JobNo}</td>
                                                <td className='text-center'>{job.StepNo}</td>
                                                <td className='text-center' onClick={() => { navigator.clipboard.writeText(`${job.PartNo}`); setShowToast(true); setPartCopy(`${job.PartNo}`) }}>{job.PartNo}</td>
                                                <td className='text-center'>{job.Revision}</td>
                                                <td className='text-center'>{job.EstimQty}</td>
                                                <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                <td className='text-center'>{job.CustCode}</td>
                                                <td className='text-center'>{job.User_Text3}</td>
                                                <td className='text-center'>{job.DrawNum && job.DrawNum.includes('S2') && <Icon icon={check}/>}</td>
                                                <td className='text-center'>{job.DrawNum && job.DrawNum.includes('S3') && <Icon icon={check}/>}</td>
                                                <td className='text-center'>{job.DrawNum && job.DrawNum.includes('AP') && <Icon icon={check}/>}</td>
                                                <td className='text-center' onClick={() => { navigator.clipboard.writeText(`${job.Descrip}`); setShowToast(true); setPartCopy(`${job.Descrip}`) }}>{job.Descrip}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                            <Icon size={24} icon={refresh}/>
                        </Button>
                        <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1 }}>
                            <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                <Toast.Body>
                                    <strong className="me-auto">{partCopy} Copied To Clipboard </strong>
                                </Toast.Body>
                            </Toast>
                        </ToastContainer>
                    </div>
                </div>
            }
        </div>
    )
}