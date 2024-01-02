import { useEffect, useState } from 'react';
import { Button, Dropdown, FloatingLabel, Form, Modal, Nav, NavDropdown, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import {check} from 'react-icons-kit/entypo/check'

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFRJobs from '../../services/engineering/getFRJobs';
import updateJob from '../../services/engineering/updateJob';
import updateModel from '../../services/engineering/updateModel';
import { Sidebar } from '../sidebar/Sidebar';
import './engineering.css';

export const Quality = () => {
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

    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
    const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
    const [searchedValueDueDate, setSearchedValueDueDate] = useState('');
    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueType, setSearchedValueType] = useState('');
    const [searchedValueEngineer, setSearchedValueEngineer] = useState('');
    const [searchedValueQuote, setSearchedValueQuote] = useState('');
    const [searchedValueStatus, setSearchedValueStatus] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');
    const [update, setUpdate] = useState('');

    const [searchedEng, setSearchedEng] = useState([]);
    const [searchedTBR, setSearchedTBR] = useState([]);
    const [searchedFR, setSearchedFR] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const [jobNoInfo, setJobNoInfo] = useState();
    const [custInfo, setCustInfo] = useState();
    const [partNoInfo, setParNoInfo] = useState();
    const [engineerInfo, setEngineerInfo] = useState();
    const [jobStatus, setJobStatus] = useState(' ');

    const [tbr, setTbr] = useState('TBR');
    const [future, setFuture] = useState('Future');
    const [repeat, setRepeat] = useState('Repeat');
    const [outsource, setOutsource] = useState('Outsource');
    const [active, setActive] = useState('Active');

    const fetchData = () => {
        try {
            let data = getAllJobs();
            data.then((res) => {
                setSearchedEng(res);
                setLoading(false);
            })
            let tbrData = getTBRJobs();
            tbrData.then((res) => {
                setSearchedTBR(res);
            })
            let frData = getFRJobs();
            frData.then((res) => {
                setSearchedFR(res);
            })

            console.log(searchedEng)
        } catch (err) {
            console.log(err)
        }
    };

    async function toggleModel(job) {
        updateModel(job.dataValues.id);
        setUpdate(`Model ${job.dataValues.jobNo}`)
    }

    const handleClose = () => setShow(false);

    const handleSave = () => {
        updateJob(jobNoInfo, engineerInfo, jobStatus);
        setShow(false);
        fetchData();
    };

    const handleShow = (job) => {
        setShow(true);
        setJobNoInfo(job.JobNo);
        setCustInfo(job.CustCode);
        setParNoInfo(job.PartNo);
        setEngineerInfo(job.dataValues.engineer);
        setJobStatus(job.dataValues.jobStatus);
    } ;
    
    useEffect(() => {
        fetchData();
    }, [loading, show, update]);

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
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>{jobNoInfo}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form>
                            <FloatingLabel label="Customer Code" className="mb-3">
                                <Form.Control defaultValue={custInfo} disabled />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingInput" label="Engineer" className="mb-3">
                                <Form.Control placeholder="Engineer" defaultValue={engineerInfo} onChange={(e) => {setEngineerInfo(e.target.value)}} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingInput" label="Status" className="mb-3">
                                <Form.Select placeholder="Status" defaultValue={jobStatus} onChange={(e) => {setJobStatus(e.target.value)}} >
                                    <option></option>
                                    <option>WIP</option>
                                    <option>QC</option>
                                    <option>REWORK</option>
                                    <option>HOLD</option>
                                    <option>PROTO</option>
                                    <option>DONE</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Tabs
                        defaultActiveKey="tbr"
                        id="justify-tab-example"
                        className='mb-3'
                        justify
                    >
                        <Tab eventKey="tbr" title={tbr}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Step No</th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Due Date</th>
                                            <th className='text-center' width='14%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' width='8%' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='&#xf002;  Engineer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='&#xf002;  Quote' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Model</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='&#xf002;  Status' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            {/* {cookieData.maintenance &&
                                                <th className='text-center align-middle'>Actions</th>
                                            } */}
                                        </tr>
                                    </thead>
                                    <tbody>
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
                                            .filter((row) => {
                                                if (!searchedValueEngineer) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.engineer) { return false; }
                                                
                                                return row.dataValues.engineer
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueEngineer.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueQuote) { return true; }
                                                if (!row || !row.QuoteNo ) { return false; }
                                                
                                                return row.QuoteNo
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueQuote.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueStatus) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }
                                                
                                                return row.dataValues.jobStatus
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            })
                                            .map((job, index) => {
                                                if (job.User_Text2 == '2. TBR') {
                                                    return (
                                                        <tr key={index} job={job}>
                                                            <td className='text-center jobBold' onClick={() => handleShow(job)}>{job.JobNo}</td>
                                                            <td className='text-center'>{job.StepNo}</td>
                                                            <td className='text-center' onClick={() => { navigator.clipboard.writeText(`${job.PartNo}`); setShowToast(true); setPartCopy(`${job.PartNo}`) }}>{job.PartNo}</td>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.dataValues.engineer}</td>
                                                            <td className='text-center'>{job.QuoteNo}</td>
                                                            <td className='text-center' onClick={() => toggleModel(job)}>
                                                                {job.dataValues.model &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                            <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                                {/* <Dropdown>
                                                                    <Dropdown.Toggle size="sm">
                                                                        {job.dataValues.jobStatus}  
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item>Action</Dropdown.Item>
                                                                        <Dropdown.Item>Another action</Dropdown.Item>
                                                                        <Dropdown.Item>Something else</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </td> */}
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1 }}>
                                    <Toast bg='secondary' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="me-auto">{partCopy} Copied To Clipboard </strong>
                                        </Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            </div>
                        </Tab>

                        <Tab eventKey="future" title={future}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Step No</th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Due Date</th>
                                            <th className='text-center' width='14'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='&#xf002;  Engineer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='&#xf002;  Quote' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Model</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='&#xf002;  Status' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            {/* {cookieData.maintenance &&
                                                <th className='text-center align-middle'>Actions</th>
                                            } */}
                                        </tr>
                                    </thead>
                                    <tbody>
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
                                            .filter((row) => {
                                                if (!searchedValueEngineer) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.engineer) { return false; }
                                                
                                                return row.dataValues.engineer
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueEngineer.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueQuote) { return true; }
                                                if (!row || !row.QuoteNo ) { return false; }
                                                
                                                return row.QuoteNo
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueQuote.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueStatus) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }
                                                
                                                return row.dataValues.jobStatus
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            })
                                            .map((job, index) => {
                                                if (job.User_Text2 == '1. OFFICE' && job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE') {
                                                    return (
                                                        <tr key={index} job={job}>
                                                            <td className='text-center jobBold' onClick={() => handleShow(job)}>{job.JobNo}</td>
                                                            <td className='text-center'>{job.StepNo}</td>
                                                            <td className='text-center' onClick={() => { navigator.clipboard.writeText(`${job.PartNo}`); setShowToast(true); setPartCopy(`${job.PartNo}`) }}>{job.PartNo}</td>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.dataValues.engineer}</td>
                                                            <td className='text-center'>{job.QuoteNo}</td>
                                                            <td className='text-center' onClick={() => toggleModel(job)}>
                                                                {job.dataValues.model &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                            <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1 }}>
                                    <Toast bg='secondary' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="me-auto">{partCopy} Copied To Clipboard </strong>
                                        </Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            </div>
                        </Tab>

                        <Tab eventKey="repeat" title={repeat}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Step No</th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Revision</th>
                                            <th className='text-center' width='10%'>Qty</th>
                                            <th className='text-center' width='10%'>Due Date</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Type</th>
                                            <th className='text-center' width='10%'>Next Step<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  bad' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Print</th>
                                            {/* {cookieData.maintenance &&
                                                <th className='text-center align-middle'>Actions</th>
                                            } */}
                                        </tr>
                                    </thead>
                                    <tbody>
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
                                            .map((job, index) => {
                                                if (job.User_Text2 == '1. OFFICE' && job.User_Text3 == 'REPEAT') {
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
                                                            <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                            <td className='text-center'></td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1 }}>
                                    <Toast bg='secondary' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="me-auto">{partCopy} Copied To Clipboard </strong>
                                        </Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            </div>
                        </Tab>

                        <Tab eventKey="outsource" title={outsource}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Revision</th>
                                            <th className='text-center' width='10%'>Qty</th>
                                            <th className='text-center' width='10%'>Due Date</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='&#xf002;  Quote' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Print</th>
                                            {/* {cookieData.maintenance &&
                                                <th className='text-center align-middle'>Actions</th>
                                            } */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedEng
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
                                            .filter((row) => {
                                                if (!searchedValueQuote) { return true; }
                                                if (!row || !row.QuoteNo ) { return false; }
                                                
                                                return row.QuoteNo
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueQuote.toString().toLowerCase())
                                            })
                                            .filter((row) => 
                                                !searchedValueType || row.User_Text3
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueType.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                if (job.User_Text2 == '6. OUTSOURCE') {
                                                    return (
                                                        <tr key={index} job={job}>
                                                            <td className='text-center jobBold'>{job.JobNo}</td>
                                                            <td className='text-center' onClick={() => { navigator.clipboard.writeText(`${job.PartNo}`); setShowToast(true); setPartCopy(`${job.PartNo}`) }}>{job.PartNo}</td>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.QuoteNo}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'></td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1 }}>
                                    <Toast bg='secondary' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="me-auto">{partCopy} Copied To Clipboard </strong>
                                        </Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            </div>
                        </Tab>

                        <Tab eventKey="active" title={active}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='23%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='11%'>Revision</th>
                                            <th className='text-center' width='11%'>Qty</th>
                                            <th className='text-center' width='11%'>Due Date</th>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedEng
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
                                                !searchedValueArea || row.User_Text2
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueArea.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                    return (
                                                        <tr key={index} job={job}>
                                                            <td className='text-center jobBold'>{job.JobNo}</td>
                                                            <td className='text-center' onClick={() => { navigator.clipboard.writeText(`${job.PartNo}`); setShowToast(true); setPartCopy(`${job.PartNo}`) }}>{job.PartNo}</td>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.User_Text2}</td>
                                                        </tr>
                                                    )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1 }}>
                                    <Toast bg='secondary' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
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