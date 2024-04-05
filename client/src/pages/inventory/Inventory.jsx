import { useEffect, useState } from 'react';
import { Button, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import getAllScales from "../../services/scales/getAllScales";

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
    const [cookieData, setCookieData] = useState('');

    const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
    const [searchedDescription, setSearchedDescription] = useState('');
    const [searchedValueLocation, setSearchedValueLocation] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [partCopy, setPartCopy] = useState('None');

    const [allItems, setAllItems] = useState('All Items');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const scales = await getAllScales();
            setAllScales(scales)
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
                                            <th className='text-center' width='5%'>Scale Name</th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValuePartNo(e.target.value)} placeholder='&#xf002;  E2 Part No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            {/* <th className='text-center' width='7%'><input onChange={(e) => setSearchedDescription(e.target.value)} placeholder='&#xf002;  Description' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th> */}
                                            <th className='text-center' width='5%'>Description</th>
                                            <th className='text-center' width='5%'>Qty</th>
                                            <th className='text-center' width='5%'>Alert</th>
                                            <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueLocation(e.target.value)} placeholder='&#xf002;  Location' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allScales
                                            .filter((row) => 
                                                !searchedValuePartNo || row.ItemPartNumber
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePartNo.toString().toLowerCase())
                                            )
                                            // .filter((row) => 
                                            //     !searchedDescription || row.PartNo
                                            //         .toString()
                                            //         .toLowerCase()
                                            //         .includes(searchedDescription.toString().toLowerCase())
                                            // )
                                            .filter((row) => 
                                                !searchedValueLocation || row.ItemDescription
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueLocation.toString().toLowerCase())
                                            )
                                            .map((scale, index) => {
                                                const rowClass = (scale.Quantity <= scale.AlertThreshold) ? 'expedite-row' : '';
                                                return (
                                                    <tr key={index} scale={scale} className={rowClass}>
                                                        <td className='text-center jobBold'>{scale.Name}</td>
                                                        <CopyToClipboard text={scale.ItemPartNumber} onCopy={() => { setShowToast(true); setPartCopy(`${scale.ItemPartNumber}`) }}>
                                                            <td className='text-center'>{scale.ItemPartNumber}</td>
                                                        </CopyToClipboard>
                                                        <td className='text-center'>-</td>
                                                        <td className='text-center'>{scale.Quantity}</td>
                                                        <td className='text-center'>{scale.AlertThreshold}</td>
                                                        <td className='text-center'>{scale.ItemDescription}</td>
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