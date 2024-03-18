import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";

import { Icon } from 'react-icons-kit';
import { refresh } from 'react-icons-kit/fa/refresh';

import getAllJobs from '../../services/engineering/getAllJobs';
import getTBRJobs from '../../services/engineering/getTBRJobs';
import getFutureJobs from '../../services/engineering/getFutureJobs';
import getAllUsers from '../../services/users/getAllUsers';
import updateFormStatus from '../../services/forming/updateFormStatus';
import updateFormProgrammer from '../../services/forming/updateFormProgrammer';
import { Sidebar } from '../sidebar/Sidebar';
import '../programming/engineering.css';

export const FormingProg = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'forming': false,
        };
    }

    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
    const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
    const [searchedValueDueDate, setSearchedValueDueDate] = useState('');
    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueType, setSearchedValueType] = useState('');
    const [searchedValueEngineer, setSearchedValueEngineer] = useState('');
    const [searchedValueProgrammer, setSearchedValueProgrammer] = useState('');
    const [searchedValueQuote, setSearchedValueQuote] = useState('');
    const [searchedValueStatus, setSearchedValueStatus] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');
    const [update, setUpdate] = useState('');

    const [searchedEng, setSearchedEng] = useState([]);
    const [searchedTBR, setSearchedTBR] = useState([]);
    const [searchedFuture, setSearchedFuture] = useState([]);
    const [formingUsers, setFormingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dropdownTBRTitles, setDropdownTBRTitles] = useState({});
    const [dropdownFutureTitles, setDropdownFutureTitles] = useState({});
    const [dropdownTBRStatuses, setDropdownTBRStatuses] = useState({});
    const [dropdownFutureStatuses, setDropdownFutureStatuses] = useState({});

    const [tbr, setTbr] = useState('');
    const [future, setFuture] = useState('');
    const [BDTest, setBDTest] = useState('');

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
    
                let bdCount = ((res1.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.formStatus == 'BD TEST'))).length);
                (bdCount > 0) ? setBDTest(`BD Test (${bdCount})`) : setBDTest('BD Test');
    
                let tbrCount = ((res2.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length);
                (tbrCount > 0) ? setTbr(`TBR (${tbrCount})`) : setTbr('TBR');
    
                let futureCount = ((res3.filter(row => (typeof row.JobNo !== 'undefined' && row.dataValues.jobStatus == 'FORMING'))).length);
                (futureCount > 0) ? setFuture(`Future (${futureCount})`) : setFuture('Future');
    
                setFormingUsers(res4.data.filter(user => user.forming).map(user => user.name.split(' ')[0]));

                setLoading(false);
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleTBRFormProgrammer = async (job, formProgrammer) => {
        setDropdownTBRTitles(prevState => ({
            ...prevState,
            [job.JobNo]: formProgrammer
        }));
        try {
            await updateFormProgrammer(job.dataValues.jobNo, formProgrammer);
            const res = await getTBRJobs();
            setSearchedTBR(res);
        } catch (err) {
            console.log(err);
        }
    };
    
    const handleTBRJobStatus = async (job, formStatus) => {
        setDropdownTBRStatuses(prevState => ({
            ...prevState,
            [job.JobNo]: formStatus
        }));
        try {
            await updateFormStatus(job.dataValues.jobNo, formStatus);
            const res = await getTBRJobs();
            setSearchedTBR(res);
        } catch (err) {
            console.log(err);
        }
    };
    
    const handleFutureFormProgrammer = async (job, formProgrammer) => {
        setDropdownFutureTitles(prevState => ({
            ...prevState,
            [job.JobNo]: formProgrammer
        }));
        try {
            await updateFormProgrammer(job.dataValues.jobNo, formProgrammer);
            const res = await getFutureJobs();
            setSearchedFuture(res);
        } catch (err) {
            console.log(err);
        }
    };
        
    const handleFutureJobStatus = async (job, formStatus) => {
        setDropdownFutureStatuses(prevState => ({
            ...prevState,
            [job.JobNo]: formStatus
        }));
        try {
            await updateFormStatus(job.dataValues.jobNo, formStatus);
            const res = await getFutureJobs();
            setSearchedFuture(res);
        } catch (err) {
            console.log(err);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [loading, update]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Forming</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Forming</h1>

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
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Due Date</th>
                                            <th className='text-center' width='14%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' width='8%' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='&#xf002;  Engineer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueProgrammer(e.target.value)} placeholder='&#xf002;  Programmer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
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
                                                if (!searchedValueProgrammer) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.formProgrammer) { return false; }
                                                
                                                return row.dataValues.formProgrammer
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueProgrammer.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueStatus) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.formStatus) { return false; }
                                                
                                                return row.dataValues.formStatus
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            })
                                            .map((job, index) => {
                                                if (job.dataValues.jobStatus == 'FORMING') {
                                                    const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                                                    const dropdownTBRTitle = dropdownTBRTitles[job.JobNo] || job.dataValues.formProgrammer;
                                                    const dropdownTBRStatus = dropdownTBRStatuses[job.JobNo] || job.dataValues.formStatus;
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
                                                            {cookieData.forming ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={dropdownTBRTitle} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        {formingUsers.map((user, n) => (
                                                                            <Dropdown.Item key={n} onClick={() => handleTBRFormProgrammer(job, user)} className='dropDownItem'>{user}</Dropdown.Item>
                                                                        ))}
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleTBRFormProgrammer(job, '')} className='dropDownItem'>None</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.formProgrammer}</td>
                                                            }
                                                            {cookieData.forming ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={dropdownTBRStatus} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'WIP')} className='dropDownItem'>WIP</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'BD TEST')} className='dropDownItem'>BD TEST</Dropdown.Item>
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleTBRJobStatus(job, 'DONE')} className='dropDownItem'>DONE</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                            <td className='text-center'>{job.dataValues.formStatus}</td>
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
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Due Date</th>
                                            <th className='text-center' width='14'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueEngineer(e.target.value)} placeholder='&#xf002;  Engineer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueProgrammer(e.target.value)} placeholder='&#xf002;  Programmer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
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
                                                if (!searchedValueProgrammer) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.formProgrammer) { return false; }
                                                
                                                return row.dataValues.formProgrammer
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueProgrammer.toString().toLowerCase())
                                            })
                                            .filter((row) => {
                                                if (!searchedValueStatus) { return true; }
                                                if (!row || !row.dataValues || !row.dataValues.formStatus) { return false; }
                                                
                                                return row.dataValues.formStatus
                                                    .toString()
                                                    .toLowerCase()                                           
                                                    .includes(searchedValueStatus.toString().toLowerCase())
                                            })
                                            .map((job, index) => {
                                                if (job.User_Text3 != 'REPEAT' && job.User_Text2 != '6. OUTSOURCE' && job.dataValues.jobStatus == 'FORMING') {
                                                    const rowClass = job.WorkCode == 'HOT' ? 'expedite-row' : '';
                                                    const dropdownFutureTitle = dropdownFutureTitles[job.JobNo] || job.dataValues.formProgrammer;
                                                    const dropdownFutureStatus = dropdownFutureStatuses[job.JobNo] || job.dataValues.formStatus;
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
                                                            {cookieData.forming ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={dropdownFutureTitle} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        {formingUsers.map((user, n) => (
                                                                            <Dropdown.Item key={n} onClick={() => handleFutureFormProgrammer(job, user)} className='dropDownItem'>{user}</Dropdown.Item>
                                                                        ))}
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleFutureFormProgrammer(job, '')} className='dropDownItem'>None</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.formProgrammer}</td>
                                                            }
                                                            {cookieData.forming ?
                                                                <td className='text-center'>
                                                                    <DropdownButton title={dropdownFutureStatus} align={{ lg: 'start' }} className='text-center dropDowns'>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'WIP')} className='dropDownItem'>WIP</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'BD TEST')} className='dropDownItem'>BD TEST</Dropdown.Item>
                                                                        <Dropdown.Divider />
                                                                        <Dropdown.Item onClick={() => handleFutureJobStatus(job, 'DONE')} className='dropDownItem'>DONE</Dropdown.Item>
                                                                    </DropdownButton>
                                                                </td>
                                                            :
                                                                <td className='text-center'>{job.dataValues.formStatus}</td>
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

                        <Tab eventKey="proto" title={BDTest}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='5%'>Revision</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Due Date</th>
                                            <th className='text-center' width='14%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueType(e.target.value)} placeholder='&#xf002;  Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='20%'>Notes</th>
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
                                                if (job.dataValues.jobStatus == 'FORMING' && job.dataValues.formStatus == 'BD TEST') {
                                                    return (
                                                        <tr key={index} job={job}>
                                                            {/* <td className='text-center jobBold' onClick={() => handleShow(job)}>{job.JobNo}</td> */}
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
                                                            <td className='text-center'>{job.dataValues.notes}</td>
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