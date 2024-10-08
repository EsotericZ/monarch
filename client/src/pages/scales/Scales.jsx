import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, FloatingLabel, Form, ListGroup, Modal, ProgressBar, Tab, Tabs, Table } from 'react-bootstrap';

import getAllChannels from "../../services/scales/getAllChannels";
import getAllPorts from "../../services/scales/getAllPorts";
import getAllSensors from "../../services/scales/getAllSensors";
import getAllScales from '../../services/scales/getAllScales';
import getMMItems from '../../services/scales/getMMItems';
import createScale from '../../services/scales/createScale';
import deleteScale from '../../services/scales/deleteScale';
import zeroScale from '../../services/scales/zeroScale';
import createItem from '../../services/scales/createItem';
import createMMItem from '../../services/scales/createMMItem';
import deleteItem from '../../services/scales/deleteItem';
import deleteMMItem from '../../services/scales/deleteMMItem';
import updateItem from '../../services/scales/updateItem';
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

export const Scales = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'purchasing': false,
        };
    }

    const [totalHubs, setTotalHubs] =useState(0);
    const [activeHubs, setActiveHubs] =useState(0);
    const [inactiveHubs, setInactiveHubs] =useState(0);
    const [percentActive, setPercentActive] = useState(0);
    const [percentInactive, setPercentInactive] = useState(0);
    const [loadingChannels, setLoadingChannles] = useState(true);
    const [count, setCount] = useState(0);

    const [searchedValueScaleName, setSearchedValueScaleName] = useState('');
    const [searchedValueItemName, setSearchedValueItemName] = useState('');
    const [searchedValueRack, setSearchedValueRack] = useState('');
    const [searchedValueShelf, setSearchedValueShelf] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [searchedValueLocation, setSearchedValueLocation] = useState('');

    const [allSensors, setAllSensors] = useState([]);
    const [allScales, setAllScales] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentScaleName, setCurrentScaleName] = useState('');
    const [currentItemName, setCurrentItemName] = useState('');
    const [currentScaleId, setCurrentScaleId] = useState(0);
    const [currentItemId, setCurrentItemId] = useState(0);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteItem, setShowDeleteItem] = useState(false);
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
    const [itemRack, setItemRack] = useState(0);
    const [itemShelf, setItemShelf] = useState(0);
    const [itemBin, setItemBin] = useState('');
    const [itemArea, setItemArea] = useState('');
    const [itemSmall, setItemSmall] = useState(false);
    
    const [portHealth, setPortHealth] = useState('Port Health');
    const [newScale, setNewScale] = useState('Create Scale');
    const [modifyScale, setModifyScale] = useState('Modify Scale');
    const [newItem, setNewItem] = useState('Create Item');
    const [modifyItem, setModifyItem] = useState('Modify Item');
    
    const fetchData = async () => {
        try {
            const [sensors, scales, mmItems] = await Promise.all([getAllSensors(), getAllScales(), getMMItems()]);
            setAllSensors(sensors);
            setAllScales(scales);

            const combinedData = scales.map(scale => {
                const matchingMMItem = mmItems.data.find(item => item.scaleId === scale.ScaleId);
                return { ...scale, ...matchingMMItem };
            });
            
            setCombinedData(combinedData);

            const hasZeroWeightScale = scales.some(scale => scale.ZeroWeight === 0);
            setNewScales(hasZeroWeightScale);
            
            const hasZeroNoItem = scales.some(scale => scale.ZeroWeight != 0 && !scale.ItemPartNumber);
            setZeroNoItem(hasZeroNoItem);

            const hasNewItem = scales.some(scale => !scale.ItemPartNumber);
            setNewItems(hasNewItem);

            setLoading(false);
        } catch (err) {
            console.log(err)
        }
    };

    const fetchPortHealthData = async () => {
        try {
            const channels = await getAllChannels();
            let channelArray = channels.split("\n")
            let newChannelArray = [...new Set(channelArray.map((channel) => channel.slice(0,6)))]
            setActiveHubs(newChannelArray.length);

            const ports = await getAllPorts();
            setTotalHubs(ports.data.length)
            setInactiveHubs(ports.data.length - newChannelArray.length);

            setPercentActive((newChannelArray.length/ports.data.length)*100);
            setPercentInactive(100 - (newChannelArray.length/ports.data.length)*100);
                    
            setLoadingChannles(false)
        } catch (err) {
            console.log(err)
        }
    }
    
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
            setScaleType(0);
            setSelectedCheckboxes([]);
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
    
    const handleCloseDeleteItem = () => setShowDeleteItem(false);
    const handleShowDeleteItem = (scale) => {
        setCurrentScaleName(scale.Name)
        setCurrentItemName(scale.ItemPartNumber)
        setCurrentScaleId(scale.ScaleId)
        setCurrentItemId(scale.ItemId)
        setShowDeleteItem(true);
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
    
    const handleDeleteItem = async () => {
        try {
            await deleteItem(currentItemId);
            await deleteScale(currentScaleId);
            await deleteMMItem(currentItemId);
            setCurrentScaleName('');
            setCurrentItemName('');
            setCurrentScaleId(0);
            setCurrentItemId(0);
            await fetchData();
        } catch (err) {
            console.error(err);
        }
        setShowDeleteItem(false);
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
        try {
            await createItem({
                ScaleId: radioScaleId,
                Description: itemLocation,
                Quantity: itemSample,
                PartNumber: itemName,
                AlertThreshold: itemAlert,
            })
            const newScales = await getAllScales();
            const desiredObject = newScales.find(obj => obj.ScaleId === radioScaleId);
            const newItemId = desiredObject.ItemId;
            await createMMItem(radioScaleId, newItemId, itemName, itemLocation, itemAlert, itemRack, itemShelf, itemBin, itemArea);
            setItemName('');
            setItemLocation('');
            setItemSample(1);
            setItemAlert(1);
            setRadioScaleId(0);
            setItemRack(0);
            setItemShelf(0);
            setItemBin('');
            setItemArea('');
            setItemSmall(false);
            await fetchData();
        } catch (err) {
            console.error(err)
        }
    };

    const handleOpenItem = (scale) => {
        setItemName(scale.itemName);
        setItemLocation(scale.itemLocation);
        setCurrentScaleId(scale.ScaleId);
        setCurrentItemId(scale.ItemId);
        setItemAlert(parseInt(scale.alert));
        setItemRack(parseInt(scale.rack));
        setItemShelf(parseInt(scale.shelf));
        setItemBin(scale.bin);
        setItemArea(scale.area);
        setItemSmall(scale.smallItem);
        setShowEdit(true);
    };

    const handleCancelEdit = () => {
        setItemName('');
        setItemLocation('');
        setCurrentScaleId(0);
        setCurrentItemId(0);
        setItemAlert(0);
        setItemRack(0);
        setItemShelf(0)
        setItemBin('');
        setItemArea('');
        setItemSmall(false);
        setShowEdit(false);
        setShowEdit(false);
    };
    
    const handleUpdateItem = async () => {
        try {
            await updateItem(itemName, itemLocation, currentItemId, itemAlert, itemRack, itemShelf, itemBin, itemArea, itemSmall);
        } catch (err) {
            console.error(err)
        }
        setItemName('');
        setItemLocation('');
        setCurrentScaleId(0);
        setCurrentItemId(0);
        setItemAlert(0);
        setItemRack(0);
        setItemShelf(0)
        setItemBin('');
        setItemArea('');
        setItemSmall(false);
        setShowEdit(false);
        await fetchData();
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        fetchPortHealthData();
    }, []);
    
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Scales</h1>
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
                            <div>Warning! Your Are About To Delete Scale</div>
                            <div><b>{currentScaleName}</b></div>
                            <div className='mt-3'>Are You Sure?</div>
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

                    <Modal show={showDeleteItem}>
                        <Modal.Header>
                            <Modal.Title>Delete Item</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <div>Warning! Your Are About To Delete Item</div>
                            <div><b>{currentItemName}</b></div>
                            <div>This Will Also Delete Scale</div>
                            <div><b>{currentScaleName}</b></div>
                            <div className='mt-3'>Are you sure?</div>
                        </Modal.Body>
                        <Modal.Footer className="justify-content-center">
                            <Button className='modalBtnCancel' variant="secondary" onClick={handleCloseDeleteItem}>
                                Cancel
                            </Button>
                            <Button className='modalBtnVerify' variant="primary" onClick={handleDeleteItem}>
                                Verify
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showEdit}>
                        <Modal.Header>
                            <Modal.Title>Update Item</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FloatingLabel label="Item Name" className="mb-3">
                                <Form.Control defaultValue={itemName} onChange={(e) => {setItemName(e.target.value)}} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingInput" label="Item Bin Location" className="mb-3">
                                <Form.Control defaultValue={itemLocation} onChange={(e) => {setItemLocation(e.target.value)}} />
                            </FloatingLabel>
                            <div className="row">
                                <div className="col">
                                    <FloatingLabel controlId="floatingInput" label="Scale ID" className="mb-3">
                                        <Form.Control disabled defaultValue={currentScaleId} />
                                    </FloatingLabel>
                                </div>
                                <div className="col">
                                    <FloatingLabel controlId="floatingInput" label="Item ID" className="mb-3">
                                        <Form.Control disabled defaultValue={currentItemId} />
                                    </FloatingLabel>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col">
                                    <FloatingLabel controlId="floatingInput" label="Rack" className="mb-3">
                                        <Form.Control defaultValue={itemRack} onChange={(e) => {setItemRack(parseInt(e.target.value))}} />
                                    </FloatingLabel>
                                </div>
                                <div className="col">
                                    <FloatingLabel controlId="floatingInput" label="Shelf" className="mb-3">
                                        <Form.Control defaultValue={itemShelf} onChange={(e) => {setItemShelf(parseInt(e.target.value))}} />
                                    </FloatingLabel>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <FloatingLabel controlId="floatingInput" label="Bin" className="mb-3">
                                        <Form.Control defaultValue={itemBin} onChange={(e) => {setItemBin(e.target.value)}} />
                                    </FloatingLabel>
                                </div>
                                <div className="col">
                                    <FloatingLabel controlId="floatingInput" label="Area" className="mb-3">
                                        <Form.Control defaultValue={itemArea} as="select" name="area" onChange={(e) => {setItemArea(e.target.value)}}>
                                            <option> </option>
                                            <option>Laser</option>
                                            <option>Material</option>
                                            <option>Misc</option>
                                            <option>Paint</option>
                                            <option>Safety</option>
                                            <option>Sanding</option>
                                            <option>Shop</option>
                                            <option>Weld</option>
                                        </Form.Control>
                                    </FloatingLabel>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <FloatingLabel controlId="floatingInput" label="Alert Threshold" className="mb-3">
                                        <Form.Control defaultValue={itemAlert} onChange={(e) => {setItemAlert(parseInt(e.target.value))}} />
                                    </FloatingLabel>
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Form.Check 
                                        type="checkbox"
                                        label="Small Item"
                                        checked={itemSmall}
                                        onChange={(e) => setItemSmall(e.target.checked)}
                                    />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className='modalBtnCancel' variant="secondary" onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                            <Button className='modalBtnVerify' variant="primary" onClick={handleUpdateItem}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {cookieData.purchasing ?
                        <Tabs
                            defaultActiveKey="portHealth"
                            id="justify-tab-example"
                            className='mb-3'
                            justify
                        >
                            <Tab eventKey="portHealth" title={portHealth}>
                                <Card style={{ width: '30%' }} className="cards">
                                    <Card.Body>
                                        <Card.Title className="text-center">Hub Health</Card.Title>
                                        <Card.Text className="text-center">Total Hubs: {totalHubs}</Card.Text>
                                        <ProgressBar className="mb-3">
                                            <ProgressBar variant='success' now={percentActive} />
                                            <ProgressBar variant='danger' now={percentInactive} />
                                        </ProgressBar>
                                        <ListGroup>
                                            <ListGroup.Item>{activeHubs} Active</ListGroup.Item>
                                            <ListGroup.Item>
                                                <div className="inactive">
                                                    {inactiveHubs} Down
                                                </div>
                                                <div className="inactive inicon">
                                                    {inactiveHubs ? <Icon align={'right'} icon={warning} size={18} style={{ color: 'red' }} /> : ''}
                                                </div>
                                            </ListGroup.Item>
                                        </ListGroup>
                                        <Link to='/hubHealth'>
                                            <button className='invBtn'>Manage</button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Tab>
                            
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
                                                    <th className='text-center'><input onChange={(e) => setSearchedValueScaleName(e.target.value)} placeholder='&#xf002;  Scale Name' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                    <th className='text-center'>Zero Weight</th>
                                                    <th className='text-center'>Connected</th>
                                                    <th className='text-center'>Zero Scale</th>
                                                    <th className='text-center'>Delete Scale</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {newScales &&
                                                    <tr className='divide'>
                                                        <td className='text-center' colSpan='5'>New</td>
                                                    </tr>
                                                }
                                                {allScales
                                                    .filter(scale => scale.ZeroWeight == 0)
                                                    .filter((row) => 
                                                        !searchedValueScaleName || row.Name
                                                            .toString()
                                                            .toLowerCase()
                                                            .includes(searchedValueScaleName.toString().toLowerCase())
                                                    )
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
                                                        <td className='text-center' colSpan='5'></td>
                                                    </tr>
                                                }
                                                {zeroNoItem &&
                                                    <tr className='divide'>
                                                        <td className='text-center' colSpan='5'>No Item Attached</td>
                                                    </tr>
                                                }
                                                {allScales
                                                    .filter(scale => scale.ZeroWeight != 0 && !scale.ItemPartNumber)
                                                    .filter((row) => 
                                                        !searchedValueScaleName || row.Name
                                                            .toString()
                                                            .toLowerCase()
                                                            .includes(searchedValueScaleName.toString().toLowerCase())
                                                    )
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
                                                        <td className='text-center' colSpan='5'></td>
                                                    </tr>
                                                }
                                                <tr className='divide'>
                                                    <td className='text-center' colSpan='5'>Existing</td>
                                                </tr>
                                                {allScales
                                                    .filter(scale => scale.ZeroWeight != 0 && scale.ItemPartNumber)
                                                    .filter((row) => 
                                                        !searchedValueScaleName || row.Name
                                                            .toString()
                                                            .toLowerCase()
                                                            .includes(searchedValueScaleName.toString().toLowerCase())
                                                    )
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
                                                                    Delete Item
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
                                                    <Form.Label className='mt-3'>Part Location ID</Form.Label>
                                                    <Form.Control 
                                                        type='text'
                                                        value={itemLocation}
                                                        onChange={(e) => setItemLocation(e.target.value)}
                                                    />
                                                    <div className="row">
                                                        <div className="col">
                                                            <Form.Label className='mt-3'>Sample Quantity</Form.Label>
                                                            <Form.Control 
                                                                type='text'
                                                                value={itemSample}
                                                                onChange={(e) => setItemSample(parseInt(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Form.Label className='mt-3'>Alert Threshold</Form.Label>
                                                            <Form.Control 
                                                                type='text'
                                                                value={itemAlert}
                                                                onChange={(e) => setItemAlert(parseInt(e.target.value))}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col">
                                                            <Form.Label className='mt-3'>Rack</Form.Label>
                                                            <Form.Control 
                                                                type='text'
                                                                value={itemRack}
                                                                onChange={(e) => setItemRack(parseInt(e.target.value))}
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Form.Label className='mt-3'>Shelf</Form.Label>
                                                            <Form.Control 
                                                                type='text'
                                                                value={itemShelf}
                                                                onChange={(e) => setItemShelf(parseInt(e.target.value))}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col">
                                                            <Form.Label className='mt-3'>Bin</Form.Label>
                                                            <Form.Control 
                                                                type='text'
                                                                value={itemBin}
                                                                onChange={(e) => setItemBin(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Form.Label className='mt-3'>Area</Form.Label>
                                                            <Form.Control as="select" name="area" onChange={(e) => {setItemArea(e.target.value)}}>
                                                                <option> </option>
                                                                <option>Laser</option>
                                                                <option>Material</option>
                                                                <option>Misc</option>
                                                                <option>Paint</option>
                                                                <option>Safety</option>
                                                                <option>Sanding</option>
                                                                <option>Shop</option>
                                                                <option>Weld</option>
                                                            </Form.Control>
                                                        </div>
                                                    </div>
                                                    <Form.Label className='mt-3'>Scale Name</Form.Label>
                                                    <div className="form-check-columns-scales">
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
                                <div>
                                    <div className='mx-3'>
                                        <Table striped hover>
                                            <thead>
                                                <tr>
                                                    <th className='text-center'><input onChange={(e) => setSearchedValueItemName(e.target.value)} placeholder='&#xf002;  Item Name' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                    <th className='text-center'><input onChange={(e) => setSearchedValueRack(e.target.value)} placeholder='&#xf002;  Rack' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                    <th className='text-center'><input onChange={(e) => setSearchedValueShelf(e.target.value)} placeholder='&#xf002;  Shelf' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                    <th className='text-center'>Bin</th>
                                                    <th className='text-center'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                    <th className='text-center'><input onChange={(e) => setSearchedValueLocation(e.target.value)} placeholder='&#xf002;  Bin Location' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                    <th className='text-center'>Alert Threshold</th>
                                                    <th className='text-center'>Small Item</th>
                                                    <th className='text-center'>Delete Item</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {combinedData
                                                    .filter(scale => scale.ItemPartNumber)
                                                    .filter((row) => 
                                                        !searchedValueItemName || row.itemName
                                                            .toString()
                                                            .toLowerCase()
                                                            .includes(searchedValueItemName.toString().toLowerCase())
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
                                                    .filter((row) => 
                                                        !searchedValueArea || row.area
                                                            .toString()
                                                            .toLowerCase()
                                                            .includes(searchedValueArea.toString().toLowerCase())
                                                    )
                                                    .filter((row) => 
                                                        !searchedValueLocation || row.itemLocation
                                                            .toString()
                                                            .toLowerCase()
                                                            .includes(searchedValueLocation.toString().toLowerCase())
                                                    )
                                                    .map((scale, index) => {
                                                        return (
                                                            <tr key={index} scale={scale}>
                                                                <td className='text-center' onClick={() => handleOpenItem(scale)}>{scale.itemName}</td>
                                                                <td className='text-center'>{scale.rack}</td>
                                                                <td className='text-center'>{scale.shelf}</td>
                                                                <td className='text-center'>{scale.bin}</td>
                                                                <td className='text-center'>{scale.area}</td>
                                                                <td className='text-center'>{scale.itemLocation}</td>
                                                                <td className='text-center'>{scale.alert}</td>
                                                                <td className='text-center'>
                                                                    {scale.smallItem &&
                                                                        <Icon icon={check}/>
                                                                    }
                                                                </td>
                                                                <td className='text-center'>
                                                                    <Icon icon={remove} onClick={() => handleShowDeleteItem(scale)} />
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
                        </Tabs>
                    :
                        <h1>You Don't Have Permission To View This Page</h1>
                    }
                </div>
            }
        </div>
    )
}