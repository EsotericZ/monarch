import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, FloatingLabel, Form, Modal, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/entypo/check';
import { refresh } from 'react-icons-kit/fa/refresh';

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getRepeatJobs from '../../services/engineering/getRepeatJobs';
import getOutsourceJobs from '../../services/engineering/getOutsourceJobs';
import getNextStep from '../../services/engineering/getNextStep';
import getPrints from '../../services/engineering/getPrints';
import getOutsourcePrints from '../../services/engineering/getOutsourcePrints';
import updateJob from '../../services/engineering/updateJob';
import updateModel from '../../services/engineering/updateModel';
import updateEngineer from '../../services/engineering/updateEngineer';
import { Sidebar } from '../sidebar/Sidebar';
import './engineering.css';

export const EngJobs = () => {
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
    const [searchedValueStep, setSearchedValueStep] = useState('');
    const [searchedValueEngineer, setSearchedValueEngineer] = useState('');
    const [searchedValueQuote, setSearchedValueQuote] = useState('');
    const [searchedValueStatus, setSearchedValueStatus] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');
    const [update, setUpdate] = useState('');

    const [searchedEng, setSearchedEng] = useState([]);
    const [searchedTBR, setSearchedTBR] = useState([]);
    const [searchedFuture, setSearchedFuture] = useState([]);
    const [searchedRepeat, setSearchedRepeat] = useState([]);
    const [searchedOutsource, setSearchedOutsource] = useState([]);
    const [searchedNextStep, setSearchedNextStep] = useState([]);
    const [searchedPrints, setSearchedPrints] = useState([]);
    const [searchedOutsourcePrints, setSearchedOutsourcePrints] = useState([]);
    const [fullRepeats, setFullRepeats] = useState([]);
    const [fullOutsource, setFullOutsource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const [jobNoInfo, setJobNoInfo] = useState();
    const [custInfo, setCustInfo] = useState();
    const [partNoInfo, setPartNoInfo] = useState();
    const [engineerInfo, setEngineerInfo] = useState();
    const [jobStatus, setJobStatus] = useState(' ');

    const [tbr, setTbr] = useState('');
    const [future, setFuture] = useState('');
    const [repeat, setRepeat] = useState('');
    const [outsource, setOutsource] = useState('');
    const [active, setActive] = useState('Active');

    const updateData = () => {
        try {
            getTBRJobs()
                .then((res) => {
                    setSearchedTBR(res);
                })
        } catch (err) {
            console.log(err)
        }
    }

    const fetchData = async () => {
        try {
            const [engRes, tbrRes, futureRes, nextStepRes, printsRes, repeatRes, outsourcePrintsRes, outsourceRes] = await Promise.all([
                getAllJobs(),
                getTBRJobs(),
                getFutureJobs(),
                getNextStep(),
                getPrints(),
                getRepeatJobs(),
                getOutsourcePrints(),
                getOutsourceJobs(),
            ]);
    
            setSearchedEng(engRes);
    
            setSearchedTBR(tbrRes);
            let tbrCount = tbrRes.filter(row => typeof row.JobNo !== 'undefined').length;
            setTbr(tbrCount > 0 ? `TBR (${tbrCount})` : 'TBR');
    
            setSearchedFuture(futureRes);
            let futureCount = futureRes.filter(row => typeof row.JobNo !== 'undefined' && row.User_Text3 !== 'REPEAT').length;
            setFuture(futureCount > 0 ? `Future (${futureCount})` : 'Future');
    
            setSearchedNextStep(nextStepRes);
    
            setSearchedPrints(printsRes);
    
            setSearchedRepeat(repeatRes);
            let repeatCount = repeatRes.length;
            setRepeat(repeatCount > 0 ? `Repeat (${repeatCount})` : 'Repeat');
        
            setFullRepeats(
                repeatRes.map(v => {
                    let obj1 = nextStepRes.find(o => o.JobNo === v.JobNo);
                    if (obj1) {
                    v.WorkCntr = obj1.WorkCntr;
                    }

                    let obj = printsRes.find(x => x.PartNo === v.PartNo);
                    v.DocNumber = obj ? obj.DocNumber : '';

                    return v;
                })
            );
        
            setSearchedOutsourcePrints(outsourcePrintsRes);
    
            setSearchedOutsource(outsourceRes);
            let outsourceCount = outsourceRes.length;
            setOutsource(outsourceCount > 0 ? `Outsource (${outsourceCount})` : 'Outsource');
        
            setFullOutsource(
                outsourceRes.map(v => {
                    let obj = outsourcePrintsRes.find(x => x.PartNo === v.PartNo);
                    v.DocNumber = obj ? obj.DocNumber : '';

                    return v;
                })
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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
        setPartNoInfo(job.PartNo);
        setEngineerInfo(job.dataValues.engineer);
        setJobStatus(job.dataValues.jobStatus);
    } ;

    const handleEngineer = (job, engineer) => {
        updateEngineer(job.dataValues.jobNo, engineer);
        setTimeout(() => {
            updateData();
        }, "5");
    }
    
    useEffect(() => {
        fetchData();
    }, [loading, show, update, updateEngineer]);

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
                                    <option>FORMING</option>
                                    {/* <option>FINALIZE</option> */}
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
                                                return (
                                                    <tr key={index} job={job}>
                                                        <td className='text-center jobBold' onClick={() => handleShow(job)}>{job.JobNo}</td>
                                                        <td className='text-center'>{job.StepNo}</td>
                                                        <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                            <td className='text-center'>{job.PartNo}</td>
                                                        </CopyToClipboard>
                                                        <td className='text-center'>{job.Revision}</td>
                                                        <td className='text-center'>{job.EstimQty}</td>
                                                        <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                        <td className='text-center'>{job.CustCode}</td>
                                                        <td className='text-center'>{job.User_Text3}</td>
                                                        {/* <td className='text-center'>{job.dataValues.engineer}</td> */}
                                                        <DropdownButton title={job.dataValues.engineer} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                            <Dropdown.Item onClick={() => handleEngineer(job, 'CJ')} className='dropDownItem'>CJ</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => handleEngineer(job, 'Ramon')} className='dropDownItem'>Ramon</Dropdown.Item>
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item onClick={() => handleEngineer(job, '')} className='dropDownItem'>None</Dropdown.Item>
                                                        </DropdownButton>
                                                        <td className='text-center'>{job.QuoteNo}</td>
                                                        <td className='text-center' onClick={() => toggleModel(job)}>
                                                            {job.dataValues.model &&
                                                                <Icon icon={check}/>
                                                            }
                                                        </td>
                                                        <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                                <ToastContainer className="toastCopy" style={{ zIndex: 1 }}>
                                    <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="mx-auto me-auto">{partCopy} Copied To Clipboard </strong>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedFuture
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
                                                if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE') {
                                                    return (
                                                        <tr key={index} job={job}>
                                                            <td className='text-center jobBold' onClick={() => handleShow(job)}>{job.JobNo}</td>
                                                            <td className='text-center'>{job.StepNo}</td>
                                                            <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                                <td className='text-center'>{job.PartNo}</td>
                                                            </CopyToClipboard>
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
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                                <ToastContainer className="toastCopy" style={{ zIndex: 1 }}>
                                    <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="mx-auto me-auto">{partCopy} Copied To Clipboard </strong>
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
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueStep(e.target.value)} placeholder='&#xf002;  Next Step' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Print</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fullRepeats
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
                                                if (!searchedValueStep) { return true; }
                                                if (!row || !row.WorkCntr) { return false; }
                                                
                                                return row.WorkCntr
                                                    .toString() 
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueStep.toString().toLowerCase())
                                            })
                                            .map((job, index) => {
                                                return (
                                                    <tr key={index} job={job}>
                                                        <td className='text-center jobBold'>{job.JobNo}</td>
                                                        <td className='text-center'>{job.StepNo}</td>
                                                        <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                            <td className='text-center'>{job.PartNo}</td>
                                                        </CopyToClipboard>
                                                        <td className='text-center'>{job.Revision}</td>
                                                        <td className='text-center'>{job.EstimQty}</td>
                                                        <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                        <td className='text-center'>{job.CustCode}</td>
                                                        <td className='text-center'>{job.User_Text3}</td>
                                                        <td className='text-center'>{job.WorkCntr}</td>
                                                        <td className='text-center'>{job.DocNumber && <Icon icon={check}/> }</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                                <ToastContainer className="toastCopy" style={{ zIndex: 1 }}>
                                    <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="mx-auto me-auto">{partCopy} Copied To Clipboard </strong>
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
                                            <th className='text-center' width='5%'>Step No</th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Revision</th>
                                            <th className='text-center' width='10%'>Qty</th>
                                            <th className='text-center' width='10%'>Due Date</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueQuote(e.target.value)} placeholder='&#xf002;  Quote' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Print</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fullOutsource
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
                                                return (
                                                    <tr key={index} job={job}>
                                                        <td className='text-center jobBold'>{job.JobNo}</td>
                                                        <td className='text-center jobBold'>{job.StepNo}</td>
                                                        <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                            <td className='text-center'>{job.PartNo}</td>
                                                        </CopyToClipboard>
                                                        <td className='text-center'>{job.Revision}</td>
                                                        <td className='text-center'>{job.EstimQty}</td>
                                                        <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                        <td className='text-center'>{job.CustCode}</td>
                                                        <td className='text-center'>{job.QuoteNo}</td>
                                                        <td className='text-center'>{job.User_Text3}</td>
                                                        <td className='text-center'>{job.DocNumber && <Icon icon={check}/> }</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                                <ToastContainer className="toastCopy" style={{ zIndex: 1 }}>
                                    <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="mx-auto me-auto">{partCopy} Copied To Clipboard </strong>
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
                                                            <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                                <td className='text-center'>{job.PartNo}</td>
                                                            </CopyToClipboard>
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
                                <Button className='rounded-circle refreshBtn' onClick={() => fetchData()}>
                                    <Icon size={24} icon={refresh}/>
                                </Button>
                                <ToastContainer className="toastCopy" style={{ zIndex: 1 }}>
                                    <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                        <Toast.Body>
                                            <strong className="mx-auto me-auto">{partCopy} Copied To Clipboard </strong>
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