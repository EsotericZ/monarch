import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import getAllJobs from '../../services/punch/getAllJobs';
import getTBRJobs from '../../services/punch/getTBRJobs';
import getFRJobs from '../../services/punch/getFRJobs';
import updateJob from '../../services/engineering/updateJob';
import { Sidebar } from '../sidebar/Sidebar';
import './departments.css';

export const Punch = () => {
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
    const [searchedValueArea, setSearchedValueArea] = useState('');

    const [searchedJobs, setSearchedJobs] = useState([]);
    const [searchedTBR, setSearchedTBR] = useState([]);
    const [searchedFR, setSearchedFR] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const [jobNoInfo, setJobNoInfo] = useState();
    const [custInfo, setCustInfo] = useState();
    const [partNoInfo, setParNoInfo] = useState();
    const [engineerInfo, setEngineerInfo] = useState();
    const [jobStatus, setJobStatus] = useState(' ');

    const [jobs, setJobs] = useState('Jobs');
    const [material, setMaterial] = useState('Add Material');
    const [order, setOrder] = useState('On Order');
    const [active, setActive] = useState('Active');

    const fetchData = () => {
        try {
            let data = getAllJobs();
            data.then((res) => {
                setSearchedJobs(res);
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
                    <h1 className='text-center'>Punch</h1>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className='divide'>
                                            <td className='text-center' colspan='9'>TBR</td>
                                        </tr>
                                        <tr>
                                            <td className='text-center' colspan='9'>Loading</td>
                                        </tr>
                                        <tr className='divide'>
                                            <td className='text-center' colspan='9'>Future</td>
                                        </tr>
                                        <tr>
                                            <td className='text-center' colspan='9'>Loading</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>
                        <Tab eventKey="material" title={material}></Tab>
                        <Tab eventKey="order" title={order}></Tab>
                        <Tab eventKey="active" title={active}></Tab>
                    </Tabs>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Punch</h1>
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
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Step No</th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='8%'>Due Date</th>
                                            <th className='text-center' width='15%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='30%'><input onChange={(e) => setSearchedValueMaterial(e.target.value)} placeholder='&#xf002;  Materials' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
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
                                            .map((job, index) => {
                                                return (
                                                    <tr key={index} job={job}>
                                                        <td className='text-center jobBold' onClick={() => handleShow(job)}>{job.JobNo}</td>
                                                        <td className='text-center'>{job.StepNo}</td>
                                                        <td className='text-center'>{job.PartNo}</td>
                                                        <td className='text-center'>{job.Revision}</td>
                                                        <td className='text-center'>{job.EstimQty}</td>
                                                        <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                        <td className='text-center'>{job.CustCode}</td>
                                                        <td className='text-center'>{job.User_Text3}</td>
                                                        <td className='text-center'>{job.SubPartNo}</td>
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
                                                            <td className='text-center'>{job.PartNo}</td>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.SubPartNo}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Tab>

                        <Tab eventKey="material" title={material}>
                            <h1 className='text-center'>Work In Progress</h1>
                        </Tab>

                        <Tab eventKey="order" title={order}>
                            <h1 className='text-center'>Work In Progress</h1>
                        </Tab>

                        <Tab eventKey="active" title={active}>
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
                                            <th className='text-center' width='15%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedJobs
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
                                            .filter((row) => 
                                                !searchedValueArea || row.User_Text2
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueArea.toString().toLowerCase())
                                            )
                                            .map((job, index) => {
                                                return (
                                                    <tr key={index} job={job}>
                                                        <td className='text-center jobBold' onClick={() => handleShow(job)}>{job.JobNo}</td>
                                                        <td className='text-center'>{job.StepNo}</td>
                                                        <td className='text-center'>{job.PartNo}</td>
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
                            </div>
                        </Tab>

                    </Tabs>
                </div>
            }
        </div>
    )
}