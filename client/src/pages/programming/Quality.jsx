import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, FloatingLabel, Form, Modal, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import {check} from 'react-icons-kit/entypo/check';
import { refresh } from 'react-icons-kit/fa/refresh';

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getAllUsers from '../../services/users/getAllUsers';
import updateInspector from '../../services/quality/updateInspector';
import updateStatus from '../../services/quality/updateStatus';
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
            'quality': false,
        };
    }

    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
    const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
    const [searchedValueDueDate, setSearchedValueDueDate] = useState('');
    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueType, setSearchedValueType] = useState('');
    const [searchedValueEngineer, setSearchedValueEngineer] = useState('');
    const [searchedValueInspector, setSearchedValueInspector] = useState('');
    const [searchedValueQuote, setSearchedValueQuote] = useState('');
    const [searchedValueStatus, setSearchedValueStatus] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');
    const [update, setUpdate] = useState('');

    const [searchedEng, setSearchedEng] = useState([]);
    const [searchedTBR, setSearchedTBR] = useState([]);
    const [searchedFuture, setSearchedFuture] = useState([]);
    const [qualityUsers, setQualityUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [tbr, setTbr] = useState('');
    const [future, setFuture] = useState('');
    const [proto, setProto] = useState('');

    const fetchData = () => {
        try {
            Promise.all([
                getAllJobs(),
                getTBRJobs(),
                getFutureJobs(),
                getAllUsers()
            ]).then(([res1, res2, res3, res4]) => {
                setSearchedEng(res1);
                setSearchedTBR(res2);
                setSearchedFuture(res3);
    
                let protoCount = ((res1.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'PROTO'))).length);
                (protoCount > 0) ? setProto(`Prototype (${protoCount})`) : setProto('Prototype');
    
                let tbrCount = ((res2.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length);
                (tbrCount > 0) ? setTbr(`TBR (${tbrCount})`) : setTbr('TBR');
    
                let futureCount = ((res3.filter(row => (typeof row.JobNo !== 'undefined' && (row.dataValues.jobStatus == 'QC' || row.dataValues.jobStatus == 'CHECKING')))).length);
                (futureCount > 0) ? setFuture(`Future (${futureCount})`) : setFuture('Future');
    
                setQualityUsers(res4.data.filter(user => user.quality).map(user => user.name.split(' ')[0]));

                setLoading(false);
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleTBRInspector = async (job, inspector) => {
        try {
            await updateInspector(job.dataValues.jobNo, inspector);
            const res = await getTBRJobs();
            setSearchedTBR(res);
        } catch (err) {
            console.log(err);
        }
    }
    
    const handleTBRStatus = async (job, jobStatus) => {
        try {
            await updateStatus(job.dataValues.jobNo, jobStatus);
            const res = await getTBRJobs();
            setSearchedTBR(res);
        } catch (err) {
            console.log(err);
        }
    }

    const handleFutureInspector = async (job, inspector) => {
        try {
            await updateInspector(job.dataValues.jobNo, inspector);
            const res = await getFutureJobs();
            setSearchedFuture(res);
        } catch (err) {
            console.log(err);
        }
    }

    const handleFutureStatus = async (job, jobStatus) => {
        try {
            await updateStatus(job.dataValues.jobNo, jobStatus);
            const res = await getFutureJobs();
            setSearchedFuture(res);
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
                    <h1 className='text-center'>Quality</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Quality</h1>

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
                                            <th className='text-center' width='5%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Due Date</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' width='8%' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='8%'><input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='&#xf002;  Engineer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='8%'><input onChange={(e) => setSearchedValueInspector(e.target.value)} placeholder='&#xf002;  Inspector' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='6%'>Model</th>
                                            <th className='text-center' width='8%'><input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='&#xf002;  Status' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
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
                                                if (!searchedValueInspector) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.inspector) { return false; }
                                                
                                                return row.dataValues.inspector
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueInspector.toString().toLowerCase())
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
                                                if (job.dataValues.jobStatus == 'QC' || job.dataValues.jobStatus == 'CHECKING') {
                                                    const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                                                    return (
                                                        <tr key={index} job={job} className={rowClass}>
                                                            <td className='text-center jobBold'>{job.JobNo}</td>
                                                            <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                                <td className='text-center'>{job.PartNo}</td>
                                                            </CopyToClipboard>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.dataValues.engineer}</td>
                                                            {cookieData.quality ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={job.dataValues.inspector} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        {qualityUsers.map((user, n) => (
                                                                            <Dropdown.Item key={n} onClick={() => handleTBRInspector(job, user)} className='dropDownItem'>{user}</Dropdown.Item>
                                                                        ))}
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleTBRInspector(job, '')} className='dropDownItem'>None</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.inspector}</td>
                                                            }
                                                            <td className='text-center'>
                                                                {job.dataValues.model &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                            {cookieData.quality ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={job.dataValues.jobStatus} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        <Dropdown.Item onClick={() => handleTBRStatus(job, 'CHECKING')} className='dropDownItem'>CHECKING</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleTBRStatus(job, 'REWORK')} className='dropDownItem'>REWORK</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleTBRStatus(job, 'DONE')} className='dropDownItem'>DONE</Dropdown.Item>
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleTBRStatus(job, 'QC')} className='dropDownItem'>QC</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                            }
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

                        <Tab eventKey="future" title={future}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='5%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Due Date</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='8%'><input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='&#xf002;  Engineer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='8%'><input onChange={(e) => setSearchedValueInspector(e.target.value)} placeholder='&#xf002;  Inspector' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='6%'>Model</th>
                                            <th className='text-center' width='8%'><input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='&#xf002;  Status' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
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
                                                if (!searchedValueInspector) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.inspector) { return false; }
                                                
                                                return row.dataValues.inspector
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueInspector.toString().toLowerCase())
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
                                                if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE' && job.dataValues.jobStatus == 'QC' || job.dataValues.jobStatus == 'CHECKING') {
                                                    const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                                                    return (
                                                        <tr key={index} job={job} className={rowClass}>
                                                            <td className='text-center jobBold'>{job.JobNo}</td>
                                                            <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`) }}>
                                                                <td className='text-center'>{job.PartNo}</td>
                                                            </CopyToClipboard>
                                                            <td className='text-center'>{job.Revision}</td>
                                                            <td className='text-center'>{job.EstimQty}</td>
                                                            <td className='text-center'>{format(parseISO(job.DueDate), 'MM/dd')}</td>
                                                            <td className='text-center'>{job.CustCode}</td>
                                                            <td className='text-center'>{job.User_Text3}</td>
                                                            <td className='text-center'>{job.dataValues.engineer}</td>
                                                            {cookieData.quality ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={job.dataValues.inspector} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        {qualityUsers.map((user, n) => (
                                                                            <Dropdown.Item key={n} onClick={() => handleFutureInspector(job, user)} className='dropDownItem'>{user}</Dropdown.Item>
                                                                        ))}
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleFutureInspector(job, '')} className='dropDownItem'>None</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.inspector}</td>
                                                            }
                                                            <td className='text-center'>
                                                                {job.dataValues.model &&
                                                                    <Icon icon={check}/>
                                                                }
                                                            </td>
                                                            {cookieData.quality ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={job.dataValues.jobStatus} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        <Dropdown.Item onClick={() => handleFutureStatus(job, 'CHECKING')} className='dropDownItem'>CHECKING</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureStatus(job, 'REWORK')} className='dropDownItem'>REWORK</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureStatus(job, 'DONE')} className='dropDownItem'>DONE</Dropdown.Item>
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleFutureStatus(job, 'QC')} className='dropDownItem'>QC</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.jobStatus}</td>
                                                            }
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

                        <Tab eventKey="proto" title={proto}>
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
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueStatus(e.target.value)} placeholder='&#xf002;  Status' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
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
                                            .filter((row) => {
                                                if (!searchedValueStatus) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.jobStatus) { return false; }
                                                
                                                return row.dataValues.jobStatus
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            })
                                            .map((job, index) => {
                                                if (job.dataValues.jobStatus == 'PROTO') {
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

                    </Tabs>
                </div>
            }
        </div>
    )
}