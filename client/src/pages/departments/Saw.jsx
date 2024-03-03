import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/entypo/check';
import { plus } from 'react-icons-kit/fa/plus'
import { history } from 'react-icons-kit/fa/history'
import { refresh } from 'react-icons-kit/fa/refresh';

import getAllJobs from '../../services/saw/getAllJobs';
import getTBRJobs from '../../services/saw/getTBRJobs';
import getFRJobs from '../../services/saw/getFRJobs';
import createMaterial from '../../services/material/createMaterial';
import getAllSawMaterials from '../../services/material/getAllSawMaterials';

import updateCheck from '../../services/material/updateCheck';
import updateComplete from '../../services/material/updateComplete';
import updateNeed from '../../services/material/updateNeed';
import updateOnOrder from '../../services/material/updateOnOrder';
import updateVerified from '../../services/material/updateVerified';

import { Sidebar } from '../sidebar/Sidebar';
import './departments.css';

export const Saw = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'maintenance': false,
        };
    }

    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
    const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueType, setSearchedValueType] = useState('');
    const [searchedValueMaterial, setSearchedValueMaterial] = useState('');
    const [searchedValueProgramNo, setSearchedValueProgramNo] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');
    const [jobProgramNo, setJobProgramNo] = useState('None');
    const [jobId, setJobId] = useState(0);
    const [update, setUpdate] = useState('');

    const [searchedTBR, setSearchedTBR] = useState([]);
    const [searchedFR, setSearchedFR] = useState([]);
    const [searchedSawPrograms, setSearchedSawPrograms] = useState([]);
    const [needsNestingTBR, setNeedsNestingTBR] = useState([]);
    const [needsNestingFuture, setNeedsNestingFuture] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [showComplete, setShowComplete] = useState(false);

    const [programNo, setProgramNo] = useState();
    const [material, setMaterial] = useState();
    const [jobNo, setJobNo] = useState(' ');

    const [jobs, setJobs] = useState('All Jobs');
    const [nest, setNest] = useState('Ready to Nest');
    const [programMatl, setProgramMatl] = useState('Material');
    const [programs, setPrograms] = useState('Programs');

    const fetchData = async () => {
        try {
            const [allJobs, tbrJobs, frJobs, sawMaterials] = await Promise.all([
                getAllJobs(),
                getTBRJobs(),
                getFRJobs(),
                getAllSawMaterials()
            ]);
    
            setSearchedTBR(tbrJobs);
            setSearchedFR(frJobs);
            console.log(frJobs)
            setSearchedSawPrograms(sawMaterials.data);

            const uniq = [...new Set(sawMaterials.data.flatMap(job => job.jobNo.length > 6 ? job.jobNo.split(' ') : job.jobNo))];

            if (uniq.length > 0) {
                let tbrJobsNeeded = tbrJobs.filter(job => !uniq.includes(job.JobNo))
                setNeedsNestingTBR(tbrJobsNeeded);
                
                let futureJobsNeeded = frJobs.filter(job => !uniq.includes(job.JobNo))
                setNeedsNestingFuture(futureJobsNeeded);
            } else {
                setNeedsNestingTBR(tbrJobs);
                setNeedsNestingFuture(frJobs);
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = () => setShow(false);

    const handleSave = () => {
        createMaterial(programNo, material, jobNo, 'saw', 'saw')
        setShow(false);
        fetchData();
    };

    const handleShow = () => {
        setShow(true);
    } ;

    const toggleCheck = async (job) => {
        try {
            await updateCheck(job.id)
            setUpdate(`Check ${job.id}`)
        } catch (err) {
            console.log(err);
        }
    }

    const handleShowComplete = (job) => {
        setShowComplete(true);
        setJobProgramNo(job.programNo);
        setJobId(job.id);
    } ;

    const handleCloseComplete = () => setShowComplete(false);

    const toggleComplete = async () => {
        console.log(jobId)
        setShowComplete(false);
        try {
            await updateComplete(jobId)
            setUpdate(`Complete ${jobId}`)
        } catch (err) {
            console.log(err);
        }
    }

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
    }, [loading, show, update]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Saw</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Saw</h1>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title className="justify-content-center">Add Program</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <Form>
                                <FloatingLabel label="Program No" className="mb-3">
                                    <Form.Control onChange={(e) => {setProgramNo(e.target.value)}} />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInput" label="Material" className="mb-3">
                                    <Form.Control onChange={(e) => {setMaterial(e.target.value)}} />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInput" label="Jobs" className="mb-3">
                                    <Form.Control onChange={(e) => {setJobNo(e.target.value)}} />
                                </FloatingLabel>
                                <FloatingLabel label="Area" className="mb-3">
                                    <Form.Control defaultValue="Saw" disabled />
                                </FloatingLabel>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className="justify-content-center">
                            <Button className='modalBtnCancel' variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button className='modalBtnVerify' variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

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

                    <Tabs
                        defaultActiveKey="nest"
                        id="justify-tab-example"
                        className='mb-3'
                        justify
                    >
                        <Tab eventKey="nest" title={nest}>
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
                                            <th className='text-center'><input onChange={(e) => setSearchedValueMaterial(e.target.value)} placeholder='&#xf002;  Materials' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {needsNestingTBR.length > 1 &&
                                            <tr className='divide'>
                                                <td className='text-center' colspan='9'>TBR</td>
                                            </tr>
                                        }
                                        {needsNestingTBR
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
                                                !searchedValueMaterial || row.SubPartNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueMaterial.toString().toLowerCase())
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
                                                        <td className='text-center' onClick={() => { navigator.clipboard.writeText(`${job.SubPartNo}`); setShowToast(true); setPartCopy(`${job.SubPartNo}`) }}>{job.SubPartNo}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        {needsNestingFuture.length > 1 &&
                                            <tr className='divide'>
                                                <td className='text-center' colspan='9'>FUTURE</td>
                                            </tr>
                                        }
                                        {needsNestingFuture
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
                                                !searchedValueMaterial || row.SubPartNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueMaterial.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                if (job.User_Text2 == '1. OFFICE') {
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
                                                            <td className='text-center' onClick={() => { navigator.clipboard.writeText(`${job.SubPartNo}`); setShowToast(true); setPartCopy(`${job.SubPartNo}`) }}>{job.SubPartNo}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle addBtn' onClick={() => handleShow()}>
                                    <Icon size={24} icon={plus}/>
                                </Button>
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
                        </Tab>

                        <Tab eventKey="programMatl" title={programMatl}>
                            <div className='mx-3'>
                            <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueProgramNo(e.target.value)} placeholder='&#xf002;  Program No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueMaterial(e.target.value)} placeholder='&#xf002;  Material' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'>Check</th>
                                            <th className='text-center'>Need</th>
                                            <th className='text-center'>On Order</th>
                                            <th className='text-center'>Verified</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedSawPrograms
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
                                                return (
                                                    <tr key={index} job={job}>
                                                        <td className='text-center jobBold'>{job.programNo}</td>
                                                        <td className='text-center'>{job.material}</td>
                                                        <td className='text-center'>{job.jobNo}</td>
                                                        <td className='text-center' onClick={() => toggleCheck(job)}>
                                                            {job.checkMatl &&
                                                                <Icon icon={check}/>
                                                            }
                                                        </td>
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
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle addBtn' onClick={() => handleShow()}>
                                    <Icon size={24} icon={plus}/>
                                </Button>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                            </div>
                        </Tab>

                        <Tab eventKey="programs" title={programs}>
                            <div className='mx-3'>
                            <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueProgramNo(e.target.value)} placeholder='&#xf002;  Program No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueMaterial(e.target.value)} placeholder='&#xf002;  Material' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'>Completed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedSawPrograms
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
                                                if (job.verified) {
                                                    return (
                                                        <tr key={index} job={job}>
                                                            <td className='text-center jobBold'>{job.programNo}</td>
                                                            <td className='text-center'>{job.material}</td>
                                                            <td className='text-center'>{job.jobNo}</td>
                                                            <td className='text-center' onClick={() => handleShowComplete(job)}>
                                                                <Icon icon={history}/>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle addBtn' onClick={() => handleShow()}>
                                    <Icon size={24} icon={plus}/>
                                </Button>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                            </div>
                        </Tab>

                        <Tab eventKey="jobs" title={jobs}>
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
                                            <th className='text-center'><input onChange={(e) => setSearchedValueMaterial(e.target.value)} placeholder='&#xf002;  Materials' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedTBR.length > 1 &&
                                            <tr className='divide'>
                                                <td className='text-center' colspan='9'>TBR</td>
                                            </tr>
                                        }
                                        {searchedTBR
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
                                                !searchedValueMaterial || row.SubPartNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueMaterial.toString().toLowerCase())
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
                                                        <td className='text-center' onClick={() => { navigator.clipboard.writeText(`${job.SubPartNo}`); setShowToast(true); setPartCopy(`${job.SubPartNo}`) }}>{job.SubPartNo}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        {searchedFR.length > 1 &&
                                            <tr className='divide'>
                                                <td className='text-center' colspan='9'>FUTURE</td>
                                            </tr>
                                        }
                                        {searchedFR
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
                                                !searchedValueMaterial || row.SubPartNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueMaterial.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                // if (job.User_Text2 == '1. OFFICE') {
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
                                                            <td className='text-center' onClick={() => { navigator.clipboard.writeText(`${job.SubPartNo}`); setShowToast(true); setPartCopy(`${job.SubPartNo}`) }}>{job.SubPartNo}</td>
                                                        </tr>
                                                    )
                                                // }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle addBtn' onClick={() => handleShow()}>
                                    <Icon size={24} icon={plus}/>
                                </Button>
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
                        </Tab>

                    </Tabs>
                </div>
            }
        </div>
    )
}