import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import getAllJobs from '../../services/tlaser/getAllJobs';
import getTBRJobs from '../../services/tlaser/getTBRJobs';
import getFRJobs from '../../services/tlaser/getFRJobs';
import updateJob from '../../services/engineering/updateJob';
import { Sidebar } from '../sidebar/Sidebar';
import './departments.css';

export const TubeLaser = () => {
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
    const [searchedValueDueDate, setSearchedValueDueDate] = useState('');
    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueType, setSearchedValueType] = useState('');
    const [searchedValueMaterial, setSearchedValueMaterial] = useState('');
    const [searchedValueQuote, setSearchedValueQuote] = useState('');
    const [searchedValueStatus, setSearchedValueStatus] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');

    const [searchedTL, setSearchedTL] = useState([]);
    const [searchedTBR, setSearchedTBR] = useState([]);
    const [searchedFR, setSearchedFR] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const [jobNoInfo, setJobNoInfo] = useState();
    const [custInfo, setCustInfo] = useState();
    const [partNoInfo, setParNoInfo] = useState();
    const [engineerInfo, setEngineerInfo] = useState();
    const [jobStatus, setJobStatus] = useState(' ');

    // const [home, setHome] = useState('Home');
    const [jobs, setJobs] = useState('Jobs');
    // const [future, setFuture] = useState('Future');
    // const [repeat, setRepeat] = useState('Repeat');
    // const [active, setActive] = useState('Active');
    // const [add, setAdd] = useState('Add');
    // const [outsource, setOutsource] = useState('Outsource');
    // const [qc, setQc] = useState('QC');
    // const [hold, setHold] = useState('Hold');
    // const [all, setAll] = useState('All');

    const fetchData = () => {
        try {
            let data = getAllJobs();
            data.then((res) => {
                setSearchedTL(res);
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
            console.log(searchedFR)
        } catch (err) {
            console.log(err)
        }
    };

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
    }, [loading, show]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Tube Laser</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Tube Laser</h1>
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
                        defaultActiveKey="jobs"
                        id="justify-tab-example"
                        className='mb-3'
                        justify
                    >
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
                                            {/* <th className='text-center'>Engineer<input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='&#xf002;  .bad.' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'>Quote<input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='&#xf002;  .bad.' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center'>Model</th>
                                            <th className='text-center'>Status<input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='&#xf002;  .bad.' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th> */}
                                            {/* {cookieData.maintenance &&
                                                <th className='text-center align-middle'>Actions</th>
                                            } */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className='divide'>
                                            <td className='text-center' colspan='9'>TBR</td>
                                        </tr>
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
                                            // .filter((row) => 
                                            //     !searchedValueQuote || row.QuoteNo
                                            //         .toString()
                                            //         .toLowerCase()
                                            //         .includes(searchedValueQuote.toString().toLowerCase())
                                            // )
                                            // .filter((row) => 
                                            //     !searchedValueStatus || row.dataValues.jobStatus
                                            //         .toString()
                                            //         .toLowerCase()
                                            //         .includes(searchedValueStatus.toString().toLowerCase())
                                            // )
                                            .map((job, index) => {
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
                                                        <td className='text-center'>{job.SubPartNo}</td>
                                                        {/* <td className='text-center'>{job.dataValues.engineer}</td> */}
                                                        {/* <td className='text-center'>{job.QuoteNo}</td> */}
                                                        {/* <td className='text-center'></td> */}
                                                        {/* <td className='text-center'>{job.dataValues.jobStatus}</td> */}
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr className='divide'>
                                            <td className='text-center' colspan='9'>FUTURE</td>
                                        </tr>
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
                                                if (job.User_Text2 == '1. OFFICE') {
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
                                                            <td className='text-center'>{job.SubPartNo}</td>
                                                            {/* <td className='text-center'>{job.dataValues.engineer}</td> */}
                                                            {/* <td className='text-center'>{job.QuoteNo}</td> */}
                                                            {/* <td className='text-center'></td> */}
                                                            {/* <td className='text-center'>{job.dataValues.jobStatus}</td> */}
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

                        {/* <Tab eventKey="future" title={future}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Job No<input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Step No<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Part No<input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Revision<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Qty<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Due Date</th>
                                            <th className='text-center'>Customer<input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Type<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Engineer<input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Quote<input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Model<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Status<input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            {cookieData.maintenance &&
                                                <th className='text-center align-middle'>Actions</th>
                                            }
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
                                            .filter((row) => 
                                                !searchedValueEngineer || row.dataValues.engineer
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueEngineer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueQuote || row.QuoteNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueQuote.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueStatus || row.dataValues.jobStatus
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                if (job.User_Text2 == '1. OFFICE' && job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE') {
                                                    return (
                                                        <tr key={index} job={job} onClick={() => handleShow(job)}>
                                                            <td className='text-center'>{job.JobNo}</td>
                                                            <td className='text-center'>{job.StepNo}</td>
                                                            <td className='text-center'>{job.PartNo}</td>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.dataValues.engineer}</td>
                                                            <td className='text-center'>{job.QuoteNo}</td>
                                                            <td className='text-center'></td>
                                                            <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab> */}

                        {/* <Tab eventKey="repeat" title={repeat}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Job No<input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Step No<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Part No<input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Revision<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Qty<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Due Date<input placeholder='.x.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Customer<input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Type<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Next Step<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Print<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            {cookieData.maintenance &&
                                                <th className='text-center align-middle'>Actions</th>
                                            }
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
                                            .filter((row) => 
                                                !searchedValueEngineer || row.dataValues.engineer
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueEngineer.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueQuote || row.QuoteNo
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueQuote.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueStatus || row.dataValues.jobStatus
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                if (job.User_Text2 == '1. OFFICE' && job.User_Text3 == 'REPEAT') {
                                                    return (
                                                        <tr key={index} job={job}>
                                                            <td className='text-center'>{job.JobNo}</td>
                                                            <td className='text-center'>{job.StepNo}</td>
                                                            <td className='text-center' onClick={() => navigator.clipboard.writeText(`${job.PartNo}`)}>{job.PartNo}</td>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                            <td className='text-center'></td>
                                                            <td className='text-center'></td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab> */}

                        {/* <Tab eventKey="active" title={active}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Job No<input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Part No<input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Revision<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Qty<input placeholder='.X.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Due Date<input placeholder='.x.' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Customer<input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Type<input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='...' className='text-center' style={{width: '100%'}} /></th>
                                            <th className='text-center'>Area<input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='.bad.' className='text-center' style={{width: '100%'}} /></th>
                                            {cookieData.maintenance &&
                                                <th className='text-center align-middle'>Actions</th>
                                            }
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
                                            .map((job, index) => {
                                                // if (job.User_Text2 == '1. OFFICE' && job.User_Text3 == 'NEW' || job.User_Text3 == 'REVISION' || job.User_Text3 == 'REVIEW') {
                                                    return (
                                                        <tr key={index} job={job} onClick={() => handleShow(job)}>
                                                            <td className='text-center'>{job.JobNo}</td>
                                                            <td className='text-center'>{job.PartNo}</td>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.User_Text2}</td>
                                                        </tr>
                                                    )
                                                // }
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab> */}

                    </Tabs>
                </div>
            }
        </div>
    )
}