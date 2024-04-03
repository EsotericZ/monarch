import { useEffect, useState } from 'react';
import { Button, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';

import getAllSensors from "../../services/scales/getAllSensors";
import getAllScales from '../../services/scales/getAllScales';
import createScale from '../../services/scales/createScale';
import deleteScale from '../../services/scales/deleteScale';
import zeroScale from '../../services/scales/zeroScale';
import createItem from '../../services/scales/createItem';
import './scales.css'

import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/entypo/check';
import { refresh } from 'react-icons-kit/fa/refresh';
import { remove } from 'react-icons-kit/fa/remove'
import { playCircleO } from 'react-icons-kit/fa/playCircleO'
import { warning } from 'react-icons-kit/fa/warning'

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import PuffLoader from "react-spinners/PuffLoader";

import { Sidebar } from '../sidebar/Sidebar';

export const ScalesAdmin = () => {
    const cookies = new Cookies();

    const [cookieData, setCookieData] = useState('');

    const [allSensors, setAllSensors] = useState([]);
    const [allScales, setAllScales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentScaleName, setCurrentScaleName] = useState('');
    const [currentScaleId, setCurrentScaleId] = useState(0);
    const [showDelete, setShowDelete] = useState(false);
    const [newScales, setNewScales] = useState(false);
    const [zeroNoItem, setZeroNoItem] = useState(false);
    const [newItems, setNewItems] = useState(false);
    const [radioScaleId, setRadioScaleId] = useState(false);
    
    const [scaleName, setScaleName] = useState('');
    const [scaleType, setScaleType] = useState(0);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemLocation, setItemLocation] = useState('');
    const [itemSample, setItemSample] = useState(1);
    const [itemAlert, setItemAlert] = useState(1);
    
    const [newScale, setNewScale] = useState('Create Scale');
    const [modifyScale, setModifyScale] = useState('Modify Scale');
    const [newItem, setNewItem] = useState('Create Item');
    const [modifyItem, setModifyItem] = useState('Modify Item');
    
    const fetchData = async () => {
        try {
            const [sensors, scales] = await Promise.all([getAllSensors(), getAllScales()]);
            setAllSensors(sensors);
            setAllScales(scales);

            const hasZeroWeightScale = scales.some(scale => scale.ZeroWeight === 0);
            setNewScales(hasZeroWeightScale);
            
            const hasZeroNoItem = scales.some(scale => scale.ZeroWeight != 0 && !scale.ItemPartNumber);
            setZeroNoItem(hasZeroNoItem);

            const hasNewItem = scales.some(scale => !scale.ItemPartNumber);
            setNewItems(hasNewItem);
            console.log(hasNewItem)

            setLoading(false);
        } catch (err) {
            console.log(err)
        }
    };
    
    const handleCheckboxChange = (channelId) => {
        const isChecked = selectedCheckboxes.includes(channelId);
        if (isChecked) {
            setSelectedCheckboxes(selectedCheckboxes.filter(id => id !== channelId));
        } else {
            setSelectedCheckboxes([...selectedCheckboxes, channelId]);
        }
    };
    
    const handleSubmit = async () => {
        try {
            await createScale({
                name: scaleName,
                scaleWeightType: scaleType,
                channelIds: selectedCheckboxes,
            })
            setScaleName('');
            await fetchData();
        } catch (err) {
            console.error(err)
        }
    };
    
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = (scale) => {
        setCurrentScaleName(scale.Name)
        setCurrentScaleId(scale.ScaleId)
        setShowDelete(true);
    };
    
    const handleDeleteScale = async () => {
        try {
            await deleteScale(currentScaleId)
            setCurrentScaleName('');
            setCurrentScaleId(0);
            await fetchData();
        } catch (err) {
            console.error(err);
        }
        setShowDelete(false);
    };
    
    const handleZeroScale = async (scale) => {
        try {
            await zeroScale(scale.ScaleId)
            await fetchData();
        } catch (err) {
            console.error(err);
        }
    };
    
    const handleSubmitItem = async () => {
        console.log(itemName)
        console.log(itemLocation)
        console.log(itemSample)
        console.log(radioScaleId)
        console.log(itemAlert)
        try {
            await createItem({
                ScaleId: radioScaleId,
                Description: itemLocation,
                Quantity: itemSample,
                PartNumber: itemName,
                AlertThreshold: itemAlert,
            })
            setItemName('');
            setItemLocation('');
            setItemSample(1);
            setItemAlert(1);
            setRadioScaleId(0);
            await fetchData();
        } catch (err) {
            console.error(err)
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [])
    
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Create Scale</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Scales</h1>

                    <Modal show={showDelete}>
                        <Modal.Header>
                            <Modal.Title>Delete Scale</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <div>Warning! Your are about to delete scale <b>{currentScaleName}</b></div>
                            <div>Are you sure?</div>
                        </Modal.Body>
                        <Modal.Footer className="justify-content-center">
                            <Button className='modalBtnCancel' variant="secondary" onClick={handleCloseDelete}>
                                Cancel
                            </Button>
                            <Button className='modalBtnVerify' variant="primary" onClick={handleDeleteScale}>
                                Verify
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    
                    <Tabs
                        defaultActiveKey="newScale"
                        id="justify-tab-example"
                        className='mb-3'
                        justify
                    >
                        <Tab eventKey="newScale" title={newScale}>
                            <div className='mx-3 centered-container'>
                                <Form>
                                    <Form.Label>Scale Name</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        value={scaleName}
                                        onChange={(e) => setScaleName(e.target.value)}
                                    />
                                    <Form.Label className='mt-3'>Scale Type</Form.Label>
                                    <Form.Select 
                                        aria-label="Scale Type"
                                        value={scaleType}
                                        onChange={(e) => setScaleType(parseInt(e.target.value))}
                                        >
                                        <option value={0}>Quantity</option>
                                        <option value={1}>Percentage</option>
                                    </Form.Select>
                                    <div className="form-check-columns">
                                        {allSensors
                                            .filter(sensor => sensor.ScaleName == 'Unused')
                                            .map((sensor, index) => (
                                                <div key={index} className="form-check-column">
                                                    <Form.Check
                                                        type='checkbox'
                                                        id={sensor.ChannelId}
                                                        label={`Hub: ${sensor.HubSerialNumber} || Port: ${sensor.PortNumber} || Channel: ${sensor.ChannelNumber}`}
                                                        onChange={() => handleCheckboxChange(sensor.ChannelId)}
                                                        checked={selectedCheckboxes.includes(sensor.ChannelId)}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </Form>
                            </div>
                            <div className="d-flex justify-content-end mt-3 buttonMove">
                                <Button type='submit' className="custom-button" onClick={handleSubmit}>
                                    Create
                                </Button>
                            </div>
                        </Tab>

                        <Tab eventKey="modifyScale" title={modifyScale}>
                            <div>
                                <div className='mx-3'>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th className='text-center'>Name</th>
                                                <th className='text-center'>Zero Weight</th>
                                                <th className='text-center'>Connected</th>
                                                <th className='text-center'>Zero Scale</th>
                                                <th className='text-center'>Delete Scale</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newScales &&
                                                <tr className='divide'>
                                                    <td className='text-center' colspan='5'>New</td>
                                                </tr>
                                            }
                                            {allScales
                                                .filter(scale => scale.ZeroWeight == 0)
                                                .map((scale, index) => {
                                                    return (
                                                        <tr key={index} scale={scale}>
                                                            <td className='text-center'>{scale.Name}</td>
                                                            <td className='text-center'>{scale.ZeroWeight}</td>
                                                            {scale.Connected ?
                                                                <td className='text-center'>
                                                                    <Icon icon={check} />
                                                                </td>
                                                            :
                                                                <td className='text-center'></td>
                                                            }
                                                            <td className='text-center'>
                                                                <Icon icon={playCircleO} onClick={() => handleZeroScale(scale)} />
                                                            </td>
                                                            <td className='text-center'>
                                                                <Icon icon={remove} onClick={() => handleShowDelete(scale)} />
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            {newScales &&
                                                <tr>
                                                    <td className='text-center' colspan='5'></td>
                                                </tr>
                                            }
                                            {zeroNoItem &&
                                                <tr className='divide'>
                                                    <td className='text-center' colspan='5'>No Item Attached</td>
                                                </tr>
                                            }
                                            {allScales
                                                .filter(scale => scale.ZeroWeight != 0 && !scale.ItemPartNumber)
                                                .map((scale, index) => {
                                                    return (
                                                        <tr key={index} scale={scale}>
                                                            <td className='text-center'>{scale.Name}</td>
                                                            <td className='text-center'>{scale.ZeroWeight}</td>
                                                            {scale.Connected ?
                                                                <td className='text-center'>
                                                                    <Icon icon={check} />
                                                                </td>
                                                            :
                                                                <td className='text-center'></td>
                                                            }
                                                            <td className='text-center'>
                                                                <Icon icon={playCircleO} onClick={() => handleZeroScale(scale)} />
                                                            </td>
                                                            <td className='text-center'>
                                                                <Icon icon={remove} onClick={() => handleShowDelete(scale)} />
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            {zeroNoItem &&
                                                <tr>
                                                    <td className='text-center' colspan='5'></td>
                                                </tr>
                                            }
                                            <tr className='divide'>
                                                <td className='text-center' colspan='5'>Existing</td>
                                            </tr>
                                            {allScales
                                                .filter(scale => scale.ZeroWeight != 0 && scale.ItemPartNumber)
                                                .map((scale, index) => {
                                                    return (
                                                        <tr key={index} scale={scale}>
                                                            <td className='text-center'>{scale.Name}</td>
                                                            <td className='text-center'>{scale.ZeroWeight}</td>
                                                            {scale.Connected ?
                                                                <td className='text-center'>
                                                                    <Icon icon={check} />
                                                                </td>
                                                            :
                                                                <td className='text-center'></td>
                                                            }
                                                            <td className='text-center'>
                                                                <Icon icon={warning} onClick={() => handleZeroScale(scale)} />
                                                            </td>
                                                            <td className='text-center'>
                                                                Remove Item First
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </Tab>

                        <Tab eventKey="newItem" title={newItem}>
                                {newItems ?
                                    <>
                                        <div className='mx-3 centered-container'>
                                            <Form>
                                                <Form.Label>E2 Part Name</Form.Label>
                                                <Form.Control 
                                                    type='text'
                                                    value={itemName}
                                                    onChange={(e) => setItemName(e.target.value)}
                                                />
                                                <Form.Label className='mt-3'>Part Bin Location</Form.Label>
                                                <Form.Control 
                                                    type='text'
                                                    value={itemLocation}
                                                    onChange={(e) => setItemLocation(e.target.value)}
                                                />
                                                <Form.Label className='mt-3'>Sample Quantity</Form.Label>
                                                <Form.Control 
                                                    type='text'
                                                    value={itemSample}
                                                    onChange={(e) => setItemSample(parseInt(e.target.value))}
                                                />
                                                <Form.Label className='mt-3'>Alert Threshold</Form.Label>
                                                <Form.Control 
                                                    type='text'
                                                    value={itemAlert}
                                                    onChange={(e) => setItemAlert(parseInt(e.target.value))}
                                                />
                                                <div className="form-check-columns">
                                                    {allScales
                                                        .filter(scale => !scale.ItemPartNumber)
                                                        .map((scale, index) => (
                                                            <div key={index} className="form-check-column">
                                                                <Form.Check
                                                                    type='radio'
                                                                    id={scale.ScaleId}
                                                                    label={scale.Name}
                                                                    onChange={() => setRadioScaleId(scale.ScaleId)}
                                                                />
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </Form>
                                        </div>
                                        <div className="d-flex justify-content-end mt-3 buttonMove">
                                            <Button type='submit' className="custom-button" onClick={handleSubmitItem}>
                                                Create
                                            </Button>
                                        </div>
                                    </>
                                :
                                    <div className='text-center pt-3'>You must create an unused scale before creating an item</div>
                                }
                        </Tab>

                        <Tab eventKey="modifyItem" title={modifyItem}>
                            <div className='mx-3 centered-container'>
                                <h1>Build</h1>
                                {/* <Form>
                                    <Form.Label>Scale Name</Form.Label>
                                    <Form.Control 
                                        type='text'
                                        value={scaleName}
                                        onChange={(e) => setScaleName(e.target.value)}
                                        />
                                    <Form.Label className='mt-3'>Scale Type</Form.Label>
                                    <Form.Select 
                                        aria-label="Scale Type"
                                        value={scaleType}
                                        onChange={(e) => setScaleType(parseInt(e.target.value))}
                                        >
                                        <option value={0}>Quantity</option>
                                        <option value={1}>Percentage</option>
                                    </Form.Select>
                                    <div className="form-check-columns">
                                        {allSensors
                                            .filter(sensor => sensor.ScaleName == 'Unused')
                                            .map((sensor, index) => (
                                                <div key={index} className="form-check-column">
                                                    <Form.Check
                                                        type='checkbox'
                                                        id={sensor.ChannelId}
                                                        label={`Hub: ${sensor.HubSerialNumber} || Port: ${sensor.PortNumber} || Channel: ${sensor.ChannelNumber}`}
                                                        onChange={() => handleCheckboxChange(sensor.ChannelId)}
                                                        checked={selectedCheckboxes.includes(sensor.ChannelId)}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </Form> */}
                            </div>
                        </Tab>                        
                    </Tabs>
                </div>
            }
        </div>
    )
}