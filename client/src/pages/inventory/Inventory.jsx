import { useEffect, useState } from 'react';
import { Button, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import getAllScales from "../../services/scales/getAllScales";
import getMMItems from '../../services/scales/getMMItems';
import getScaleLogs from '../../services/scales/getScaleLogs';
import getNewRFIDLogs from '../../services/rfid/getNewRFIDLogs';
import addNewScaleLog from '../../services/scaleLogs/addNewScaleLog';

import { Icon } from 'react-icons-kit';
import { refresh } from 'react-icons-kit/fa/refresh';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import PuffLoader from "react-spinners/PuffLoader";

import { Sidebar } from '../sidebar/Sidebar';
import './inventory.css';

export const Inventory = () => {
    const cookies = new Cookies();

    const [allScales, setAllScales] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [logData, setLogData] = useState([]);
    const [cookieData, setCookieData] = useState('');

    const [searchedValueName, setSearchedValueName] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [searchedValueRack, setSearchedValueRack] = useState('');
    const [searchedValueShelf, setSearchedValueShelf] = useState('');
    const [searchedValueEmployee, setSearchedValueEmployee] = useState('');

    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');

    const [allItems, setAllItems] = useState('All Items');
    const [materials, setMaterials] = useState('Materials');
    const [logs, setLogs] = useState('Logs');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [scales, mmItems, log] = await Promise.all([getAllScales(), getMMItems(), getScaleLogs()]);
            setAllScales(scales);

            const combinedData = scales.map(scale => {
                const matchingMMItem = mmItems.data.find(item => item.scaleId === scale.ScaleId);
                return { ...scale, ...matchingMMItem };
            });

            const combinedLogs = log.map(scale => {
                const matchingItem = mmItems.data.find(item => item.itemLocation === scale.ItemName);
                return { ...scale, ...matchingItem };
            });

            setCombinedData(combinedData);
            setLogData(combinedLogs);

            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchRFID = async () => {
        try {
            const [rfidLog, logs] = await Promise.all([getNewRFIDLogs(), getScaleLogs()]);
            const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);
            const filteredLogs = logs.filter(log => new Date(log.Timestamp) >= fiveMinutesAgo);

            console.log('ran')
            console.log(rfidLog.data)
            console.log(filteredLogs)

            if (rfidLog.data && rfidLog.data.length > 0) {
                for (const log of filteredLogs) {
                    console.log(log)
                    await addNewScaleLog(log);
                };
            }
        } catch (err) {
            console.log(err)   
        }
    }

    useEffect(() => {
        // const intervalId = setInterval(fetchRFID, 150000); // 2.5 minutes
        const intervalId = setInterval(fetchRFID, 60000); // 1 minute
    
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        fetchData();
        fetchRFID()
    }, [])

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Inventory</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Inventory</h1>
                    <Tabs
                        defaultActiveKey="allItems"
                        id="justify-tab-example"
                        className='mb-3'
                        justify
                    >
                        <Tab eventKey="allItems" title={allItems}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='30%'><input onChange={(e) => setSearchedValueName(e.target.value)} placeholder='&#xf002;  E2 Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Qty</th>
                                            <th className='text-center' width='10%'>Alert</th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueRack(e.target.value)} placeholder='&#xf002;  Rack' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueShelf(e.target.value)} placeholder='&#xf002;  Shelf' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Bin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {combinedData
                                            .filter((row) => 
                                                !searchedValueName || row.itemName
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueName.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueArea || row.area
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueArea.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueRack || row.rack
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueRack.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueShelf || row.shelf
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueShelf.toString().toLowerCase())
                                            )
                                            .map((scale, index) => {
                                                if (scale.area != 'Material') {
                                                    const rowClass = (scale.Quantity <= scale.alert) ? 'expedite-row' : '';
                                                    return (
                                                        <tr key={index} scale={scale} className={rowClass}>
                                                            <CopyToClipboard text={scale.itemName} onCopy={() => { setShowToast(true); setPartCopy(`${scale.itemName}`) }}>
                                                                <td className='text-center'>{scale.itemName}</td>
                                                            </CopyToClipboard>
                                                            <td className='text-center'>{scale.Quantity}</td>
                                                            <td className='text-center'>{scale.alert}</td>
                                                            <td className='text-center'>{scale.area}</td>
                                                            <td className='text-center'>{scale.rack}</td>
                                                            <td className='text-center'>{scale.shelf}</td>
                                                            <td className='text-center'>{scale.bin}</td>
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

                        <Tab eventKey="materials" title={materials}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='30%'><input onChange={(e) => setSearchedValueName(e.target.value)} placeholder='&#xf002;  Material' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Qty</th>
                                            <th className='text-center' width='10%'>Alert</th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueRack(e.target.value)} placeholder='&#xf002;  Rack' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {combinedData
                                            .filter((row) => 
                                                !searchedValueName || row.itemName
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueName.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueRack || row.rack
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueRack.toString().toLowerCase())
                                            )
                                            .map((scale, index) => {
                                                if (scale.area === 'Material') {
                                                    const rowClass = (scale.Quantity <= scale.alert && scale.Quantity >= 0) ? 'expedite-row' : '';
                                                    return (
                                                        <tr key={index} scale={scale} className={rowClass}>
                                                            <CopyToClipboard text={scale.itemName} onCopy={() => { setShowToast(true); setPartCopy(`${scale.itemName}`) }}>
                                                                <td className='text-center'>{scale.itemName}</td>
                                                            </CopyToClipboard>
                                                            {scale.Quantity < 0 ?
                                                                <td className='text-center'>Pallet Removed</td>
                                                            :
                                                                <td className='text-center'>{scale.Quantity}</td>
                                                            }
                                                            <td className='text-center'>{scale.alert}</td>
                                                            <td className='text-center'>{scale.rack}</td>
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

                        <Tab eventKey="logs" title={logs}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='30%'><input onChange={(e) => setSearchedValueName(e.target.value)} placeholder='&#xf002;  E2 Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Old Qty</th>
                                            <th className='text-center' width='10%'>New Qty</th>
                                            <th className='text-center' width='10%'>Timestamp</th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='20%'><input onChange={(e) => setSearchedValueEmployee(e.target.value)} placeholder='&#xf002;  Employee' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logData
                                            .filter((row) => 
                                                !searchedValueName || row.itemName
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueName.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueArea || row.area
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueArea.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueEmployee || row.EmployeeName
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueEmployee.toString().toLowerCase())
                                            )
                                            .map((scale, index) => {
                                                return (
                                                    <tr key={index} scale={scale}>
                                                        <CopyToClipboard text={scale.itemName} onCopy={() => { setShowToast(true); setPartCopy(`${scale.itemName}`) }}>
                                                            <td className='text-center'>{scale.itemName}</td>
                                                        </CopyToClipboard>
                                                        <td className='text-center'>{scale.OldQuantity}</td>
                                                        <td className='text-center'>{scale.NewQuantity}</td>
                                                        <td className='text-center'>{format(parseISO(scale.Timestamp), 'MM/dd/yy hh:ma')}</td>
                                                        <td className='text-center'>{scale.area}</td>
                                                        <td className='text-center'>{scale.EmployeeName}</td>
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