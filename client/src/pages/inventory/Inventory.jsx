import { useEffect, useState } from 'react';
import { Button, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import getAllScales from "../../services/scales/getAllScales";
import getMMItems from '../../services/scales/getMMItems';
import getScaleLogs from '../../services/scales/getScaleLogs';
import getMMScaleLogs from '../../services/scaleLogs/getMMScaleLogs';
import getNewRFIDLogs from '../../services/rfid/getNewRFIDLogs';
import addNewScaleLog from '../../services/scaleLogs/addNewScaleLog';
import deleteScaleLog from '../../services/scaleLogs/deleteScaleLog';

import { Icon } from 'react-icons-kit';
import { refresh } from 'react-icons-kit/fa/refresh';
import { trashO } from 'react-icons-kit/fa/trashO';

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

    // PAGINATION SETUP
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15;
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    const generatePageNumbers = () => {
        const totalPages = Math.ceil(logData.length / rowsPerPage);
        const pages = [];
        const maxPagesToShow = 5;
    
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);
    
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
    
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const handleSearchName = (e) => {
        setSearchedValueName(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchArea = (e) => {
        setSearchedValueArea(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchEmployee = (e) => {
        setSearchedValueEmployee(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = logData
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
    );

    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');

    const [allItems, setAllItems] = useState('All Items');
    const [materials, setMaterials] = useState('Materials');
    const [logs, setLogs] = useState('Logs');
    const [loading, setLoading] = useState(true);

    const handleDelete = async (record) => {
        try {
            await deleteScaleLog(record);
            fetchData();
        } catch (err) {
            console.error(err)
        }
    };

    const fetchData = async () => {
        try {
            const [scales, mmItems, log, mmLog] = await Promise.all([getAllScales(), getMMItems(), getScaleLogs(), getMMScaleLogs()]);
            setAllScales(scales);

            const combinedData = scales.map(scale => {
                const matchingMMItem = mmItems.data.find(item => item.scaleId === scale.ScaleId);
                return { ...scale, ...matchingMMItem };
            });

            const combinedLogs = mmLog.data.map(scale => {
                const matchingItem = mmItems.data.find(item => item.itemLocation === scale.itemLocation);
                return { logid: scale.id, ...scale, ...matchingItem };
            });

            setCombinedData(combinedData);
            setLogData(combinedLogs);

            setLoading(false)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchRFID = async () => {
        try {
            const [rfidLog, logs] = await Promise.all([getNewRFIDLogs(), getScaleLogs()]);
            const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);
            const filteredLogs = logs.filter(log => new Date(log.Timestamp) >= fiveMinutesAgo);

            if (rfidLog.data && rfidLog.data.length > 0 && filteredLogs.length > 0) {
                for (const log of filteredLogs) {
                    if (new Date(log.Timestamp) > new Date(rfidLog.data[0].created)) {
                        await addNewScaleLog(log);
                    }
                };
            }
        } catch (err) {
            console.log(err)   
        }
    }

    useEffect(() => {
        const intervalId = setInterval(fetchRFID, 150000); // 2.5 minutes
    
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        fetchData();
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
                                            <th className='text-center' width='25%'>
                                                <input 
                                                    onChange={handleSearchName} 
                                                    placeholder='&#xf002;  E2 Part No' 
                                                    className='text-center searchBox' 
                                                    style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} 
                                                />
                                            </th>
                                            <th className='text-center' width='10%'>Old Qty</th>
                                            <th className='text-center' width='10%'>New Qty</th>
                                            <th className='text-center' width='10%'>Timestamp</th>
                                            <th className='text-center' width='20%'>
                                                <input 
                                                    onChange={handleSearchArea} 
                                                    placeholder='&#xf002;  Area' 
                                                    className='text-center searchBox' 
                                                    style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} 
                                                />
                                            </th>
                                            <th className='text-center' width='20%'>
                                                <input 
                                                    onChange={handleSearchEmployee} 
                                                    placeholder='&#xf002;  Employee' 
                                                    className='text-center searchBox' 
                                                    style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} 
                                                />
                                            </th>
                                            <th className='text-center' width='5%'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRows
                                            .map((scale, index) => {
                                                return (
                                                    <tr key={index} scale={scale}>
                                                        <CopyToClipboard text={scale.itemName} onCopy={() => { setShowToast(true); setPartCopy(`${scale.itemName}`) }}>
                                                            <td className='text-center'>{scale.itemName}</td>
                                                        </CopyToClipboard>
                                                        <td className='text-center'>{scale.oldQty}</td>
                                                        <td className='text-center'>{scale.newQty}</td>
                                                        <td className='text-center'>{format(parseISO(scale.timeStamp), 'MM/dd/yy hh:mm a')}</td>
                                                        <td className='text-center'>{scale.area}</td>
                                                        <td className='text-center'>{scale.employee}</td>
                                                        <td className='text-center'>
                                                            <Icon 
                                                                icon={trashO} 
                                                                size={20} 
                                                                onClick={() => handleDelete(scale)} 
                                                                style={{ cursor: 'pointer' }} 
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <div className="pagination-container">
                                        <Button
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="pagination-arrow"
                                        >
                                            &larr; Previous
                                        </Button>

                                        {generatePageNumbers().map((page, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => page !== '...' && setCurrentPage(page)}
                                                disabled={page === '...'}
                                                className={`pagination-number ${page === currentPage ? 'selected' : ''}`}
                                            >
                                                {page}
                                            </Button>
                                        ))}

                                        <Button
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === Math.ceil(logData.length / rowsPerPage)}
                                            className="pagination-arrow"
                                        >
                                            Next &rarr;
                                        </Button>
                                    </div>
                                </div>
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