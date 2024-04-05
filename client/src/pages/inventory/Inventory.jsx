import { useEffect, useState } from 'react';
import { Button, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import getAllScales from "../../services/scales/getAllScales";
import getMMItems from '../../services/scales/getMMItems';
import getScaleLogs from '../../services/scales/getScaleLogs';

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
    const [cookieData, setCookieData] = useState('');

    const [searchedValueName, setSearchedValueName] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [searchedValueRack, setSearchedValueRack] = useState('');
    const [searchedValueShelf, setSearchedValueShelf] = useState('');

    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');

    const [allItems, setAllItems] = useState('All Items');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [scales, mmItems, logs] = await Promise.all([getAllScales(), getMMItems(), getScaleLogs()]);
            setAllScales(scales);

            console.log(mmItems.data)
            console.log(logs)

            const combinedData = scales.map(scale => {
                const matchingMMItem = mmItems.data.find(item => item.scaleId === scale.ScaleId);
                return { ...scale, ...matchingMMItem };
            });

            const combinedLogs = logs.map(scale => {
                const matchingItem = mmItems.data.find(item => item.itemLocation === scale.ItemName);
                return { ...scale, ...matchingItem };
            });

            console.log(combinedLogs)
            
            setCombinedData(combinedData);

            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

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