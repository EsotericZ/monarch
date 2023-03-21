import { useEffect, useState } from 'react';
import { Button, Dropdown, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { checkCircleO } from 'react-icons-kit/fa/checkCircleO';
import { timesCircleO } from 'react-icons-kit/fa/timesCircleO';
import { compass } from 'react-icons-kit/fa/compass';

import getAllRequests from '../../services/maintenance/getAllRequests';
import getAllEquipment from '../../services/maintenance/getAllEquipment';
import createRequest from '../../services/maintenance/createRequest';
import updateRequest from '../../services/maintenance/updateRequest';
import approveRequest from '../../services/maintenance/approveRequest';
import denyRequest from '../../services/maintenance/denyRequest';
import holdRequest from '../../services/maintenance/holdRequest';
import doneRequest from '../../services/maintenance/doneRequest';
import { Sidebar } from '../sidebar/Sidebar';

export const Maintenance = () => {
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

    const [searchedMaint, setSearchedMaint] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showActive, setShowActive] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [showDeny, setShowDeny] = useState(false);
    const [showHold, setShowHold] = useState(false);
    const [showDone, setShowDone] = useState(false);
    const [showComplete, setShowComplete] = useState(false);
    const [newRequest, setNewRequest] = useState({
        requestedBy: '',
        area: '',
        equipment: '',
        requestType: 'Routine',
        description: '',
        comments: '',
    });
    const [updateSingleRequest, setUpdateSingleRequest] = useState({
        requestedBy: '',
        area: '',
        equipment: '',
        requestType: '',
        description: '',
        approvedBy: '',
        repairedBy: '',
        repairDescription: '',
        repairTime: '',
        comments: '',
    });

    const [active, setActive] = useState('');
    const [requested, setRequested] = useState('');
    const [hold, setHold] = useState('');
    const [equipmentList, setEquipmentList] = useState(['1', '2', '3', '4']);

    const [record, setRecord] = useState('');
    const [requestedBy, setRequestedBy] = useState('');
    const [area, setArea] = useState('');
    const [equipment, setEquipment] = useState('');
    const [requestType, setRequestType] = useState('');
    const [description, setDescription] = useState('');
    const [approvedBy, setApprovedBy] = useState('');
    const [repairedBy, setRepairedBy] = useState('');
    const [repairDescription, setRepairDescription] = useState('');
    const [repairTime, setRepairTime] = useState('');
    const [comments, setComments] = useState('');
    const [requestHold, setRequestHold] = useState(false);
    const [done, setDone] = useState(false);

    async function fetchData() {
        try {
            getAllEquipment()
            .then((res) => {
                setEquipmentList(res)
            });
            getAllRequests()
            .then((res) => {
                setSearchedMaint(res.data)
                setLoading(false);
                let activeCount = 0;
                let requestCount = 0;
                let holdCount = 0;
                for (let i=0; i<res.data.length; i++) {
                    if (res.data[i].approvedBy && !res.data[i].done) activeCount += 1;
                    if (!res.data[i].approvedBy && !res.data[i].hold && !res.data[i].done) requestCount += 1;
                    if (!res.data[i].approvedBy && res.data[i].hold && !res.data[i].done) holdCount += 1;
                }
                (activeCount > 0) ? setActive(`Active (${activeCount})`) : setActive('Active');
                (requestCount > 0) ? setRequested(`Requested (${requestCount})`) : setRequested('Requested');
                (holdCount > 0) ? setHold(`Hold (${holdCount})`) : setHold('Hold');
            });
        } catch (err) {
            console.log(err);
        }
    }

    const handleChangeAdd = (e) => {
        cookieData.name && setNewRequest((prev) => {
            return {...prev, 'requestedBy': cookieData.name}
        });
        const { name, value } = e.target;
        setNewRequest((prev) => {
            return {...prev, [name]: value}
        });
    };

    const handleOpenAdd = () => setShowAdd(true);
    const handleCloseAdd = () => setShowAdd(false);
    const handleSave = () => {
        createRequest(newRequest)
        .then(fetchData())
        .then(setShowAdd(false))
    };

    const handleChangeUpdate = (e) => {
        const { name, value } = e.target;
        setUpdateSingleRequest((prev) => {
            return {...prev, [name]: value}
        });
    };

    const handleOpenUpdate = (request) => {
        setUpdateSingleRequest({
            ...updateSingleRequest,
            requestedBy: request.requestedBy,
            area: request.area,
            equipment: request.equipment,
            requestType: request.requestType,
            description: request.description,
            comments: request.comments,
        });
        setRecord(request.record);
        setRequestedBy(request.requestedBy);
        setArea(request.area);
        setEquipment(request.equipment);
        setRequestType(request.requestType);
        setDescription(request.description);
        setComments(request.comments);
        setShowUpdate(true);
    };
    const handleCloseUpdate = () => setShowUpdate(false);
    const handleUpdate = () => {
        updateRequest(updateSingleRequest, record)
        .then(fetchData())
        .then(setShowUpdate(false))
    };

    const handleChangeActive = (e) => {
        const { name, value } = e.target;
        setUpdateSingleRequest((prev) => {
            return {...prev, [name]: value}
        });
    };

    const handleOpenActive = (request) => {
        setUpdateSingleRequest({
            ...updateSingleRequest,
            requestedBy: request.requestedBy,
            area: request.area,
            equipment: request.equipment,
            requestType: request.requestType,
            description: request.description,
            comments: request.comments,
            approvedBy: request.approvedBy,
            repairedBy: request.repairedBy,
            repairDescription: request.repairDescription,
            repairTime: request.repairTime,
        });
        setRecord(request.record);
        setRequestedBy(request.requestedBy);
        setArea(request.area);
        setEquipment(request.equipment);
        setRequestType(request.requestType);
        setDescription(request.description);
        setComments(request.comments);
        setApprovedBy(request.approvedBy);
        setRepairedBy(request.repairedBy);
        setRepairDescription(request.repairDescription);
        setRepairTime(request.repairTime);
        setShowActive(true);
    };
    const handleCloseActive = () => setShowActive(false);
    const handleUpdateActive = () => {
        updateRequest(updateSingleRequest, record)
        .then(fetchData())
        .then(setShowActive(false))
    };

    const handleApprove = (request) => {
        setRecord(request.record);
        setRequestHold(false);
        setApprovedBy(cookieData.name);
        setShowApprove(true);
    } 
    const handleApproveNo = () => {
        setApprovedBy('')
        setShowApprove(false);
    }
    const handleApproveYes = () => {
        approveRequest(record, approvedBy, requestHold);
        setShowApprove(false);
    }
    
    const handleDeny = (request) => {
        setRecord(request.record);
        setDone(true);
        setComments('Request Denied');
        setShowDeny(true);
    }
    const handleDenyNo = () => {
        setDone(false);
        setComments('');
        setShowDeny(false);
    }
    const handleDenyYes = () => {
        denyRequest(record, done, comments);
        setShowDeny(false);
    }

    const handleHold = (request) => {
        setRecord(request.record);
        setApprovedBy('');
        setRequestHold(true);
        setShowHold(true);
    }
    const handleHoldNo = () => {
        setRequestHold(false)
        setShowHold(false);
    }
    const handleHoldYes = () => {
        holdRequest(record, requestHold, approvedBy);
        setShowHold(false);
    }

    const handleDone = (request) => {
        setRecord(request.record);
        setDone(true);
        setShowDone(true);
    } 
    const handleDoneNo = () => {
        setDone(false);
        setShowDone(false);
    }
    const handleDoneYes = () => {
        doneRequest(record, done);
        setShowDone(false);
    }

    const handleOpenComplete = (request) => {
        setUpdateSingleRequest({
            ...updateSingleRequest,
            requestedBy: request.requestedBy,
            area: request.area,
            equipment: request.equipment,
            requestType: request.requestType,
            description: request.description,
            comments: request.comments,
        });
        setRecord(request.record);
        setRequestedBy(request.requestedBy);
        setArea(request.area);
        setEquipment(request.equipment);
        setRequestType(request.requestType);
        setDescription(request.description);
        setComments(request.comments);
        setShowComplete(true);
    };
    const handleCloseComplete = () => setShowComplete(false);

    useEffect(() => {
        fetchData();
        // fetchEquipment();
    }, [showAdd, showUpdate, showApprove, showActive, showDeny, showHold, showDone]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <h1>Loading</h1>
            :
            <div style={{ display: 'inline' }}>
                <h1>Maintenance</h1>
                <Modal show={showApprove}>
                    <Modal.Header>
                        <Modal.Title>Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Approve: Record #{record}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleApproveNo}>
                            No
                        </Button>
                        <Button variant="primary" onClick={handleApproveYes}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showDeny}>
                    <Modal.Header>
                        <Modal.Title>Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Deny: Record #{record}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDenyNo}>
                            No
                        </Button>
                        <Button variant="primary" onClick={handleDenyYes}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showHold}>
                    <Modal.Header>
                        <Modal.Title>Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Hold: Record #{record}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleHoldNo}>
                            No
                        </Button>
                        <Button variant="primary" onClick={handleHoldYes}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showDone}>
                    <Modal.Header>
                        <Modal.Title>Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Finished: Record #{record}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDoneNo}>
                            No
                        </Button>
                        <Button variant="primary" onClick={handleDoneYes}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showAdd}>
                    <Modal.Header>
                        <Modal.Title>Add Request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FloatingLabel label="Requested By" className="mb-2">
                                <Form.Control defaultValue={cookieData.name} name="requestedBy" onChange={handleChangeAdd} />
                            </FloatingLabel>
                            <FloatingLabel label="Area" className="mb-2">
                                <Form.Control name="area" onChange={handleChangeAdd} />
                            </FloatingLabel>
                            <FloatingLabel label="Equipment" className="mb-2">
                                <Form.Control as="select" name="equipment" onChange={handleChangeAdd}>
                                    <option value={''}></option>
                                    {equipmentList.map((item, index) => {
                                        return (
                                            <option key={index} value={item.PartNo}>{item.PartNo}</option>
                                        )
                                    })}
                                </Form.Control>
                            </FloatingLabel>
                            <FloatingLabel label="Request Type" className="mb-2">
                                <Form.Control as="select" name="requestType" onChange={handleChangeAdd}>
                                    <option>Routine</option>
                                    <option>Emergency</option>
                                    <option>Safety</option>
                                    <option>Planned</option>
                                </Form.Control>
                            </FloatingLabel>
                            <FloatingLabel label="Description" className="mb-2">
                                <Form.Control name="description" onChange={handleChangeAdd} />
                            </FloatingLabel>
                            <FloatingLabel label="Comments">
                                <Form.Control name="comments" onChange={handleChangeAdd} />
                            </FloatingLabel>
                        </Form>  
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAdd}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showUpdate}>
                    <Modal.Header>
                        <Modal.Title>Update: Record #{record}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FloatingLabel label="Requested By" className="mb-2">
                                <Form.Control defaultValue={requestedBy} name="requestedBy" onChange={handleChangeUpdate} />
                            </FloatingLabel>
                            <FloatingLabel label="Area" className="mb-2">
                                <Form.Control defaultValue={area} name="area" onChange={handleChangeUpdate} />
                            </FloatingLabel>
                            <FloatingLabel label="Equipment" className="mb-2">
                                <Form.Control defaultValue={equipment} name="equipment" onChange={handleChangeUpdate} />
                            </FloatingLabel>
                            <FloatingLabel label="Request Type" className="mb-2">
                                <Form.Control defaultValue={requestType} name="requestType" onChange={handleChangeUpdate} />
                            </FloatingLabel>
                            <FloatingLabel label="Description" className="mb-2">
                                <Form.Control defaultValue={description} name="description" onChange={handleChangeUpdate} />
                            </FloatingLabel>
                            <FloatingLabel label="Comments">
                                <Form.Control defaultValue={comments} name="comments" onChange={handleChangeUpdate} />
                            </FloatingLabel>
                        </Form>  
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseUpdate}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showActive}>
                    <Modal.Header>
                        <Modal.Title>Update: Record #{record}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FloatingLabel label="Requested By" className="mb-2">
                                <Form.Control disabled defaultValue={requestedBy} name="requestedBy" onChange={handleChangeActive} />
                            </FloatingLabel>
                            <FloatingLabel label="Area" className="mb-2">
                                <Form.Control disabled defaultValue={area} name="area" onChange={handleChangeActive} />
                            </FloatingLabel>
                            <FloatingLabel label="Equipment" className="mb-2">
                                <Form.Control disabled defaultValue={equipment} name="equipment" onChange={handleChangeActive} />
                            </FloatingLabel>
                            <FloatingLabel label="Request Type" className="mb-2">
                                <Form.Control disabled defaultValue={requestType} name="requestType" onChange={handleChangeActive} />
                            </FloatingLabel>
                            <FloatingLabel label="Description" className="mb-2">
                                <Form.Control disabled defaultValue={description} name="description" onChange={handleChangeActive} />
                            </FloatingLabel>
                            <FloatingLabel label="Comments" className="mb-2">
                                <Form.Control defaultValue={comments} name="comments" onChange={handleChangeActive} />
                            </FloatingLabel>
                            <FloatingLabel label="Approved By" className="mb-2">
                                <Form.Control disabled defaultValue={approvedBy} name="approvedBy" onChange={handleChangeActive} />
                            </FloatingLabel>
                            <FloatingLabel label="Repaired By" className="mb-2">
                                <Form.Control defaultValue={repairedBy} name="repairedBy" onChange={handleChangeActive} />
                            </FloatingLabel>
                            <FloatingLabel label="Repair Notes" className="mb-2">
                                <Form.Control defaultValue={repairDescription} name="repairDescription" onChange={handleChangeActive} />
                            </FloatingLabel>
                            <FloatingLabel label="Repair Time" className="mb-2">
                                <Form.Control defaultValue={repairTime} name="repairTime" onChange={handleChangeActive} />
                            </FloatingLabel>
                        </Form>  
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseActive}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleUpdateActive}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showComplete} onHide={handleCloseComplete} centered>
                    <Modal.Header>
                        <Modal.Title>Completed: Record #{record}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FloatingLabel label="Requested By" className="mb-2">
                                <Form.Control disabled defaultValue={requestedBy} name="requestedBy" />
                            </FloatingLabel>
                            <FloatingLabel label="Area" className="mb-2">
                                <Form.Control disabled defaultValue={area} name="area" />
                            </FloatingLabel>
                            <FloatingLabel label="Equipment" className="mb-2">
                                <Form.Control disabled defaultValue={equipment} name="equipment" />
                            </FloatingLabel>
                            <FloatingLabel label="Request Type" className="mb-2">
                                <Form.Control disabled defaultValue={requestType} name="requestType" />
                            </FloatingLabel>
                            <FloatingLabel label="Description" className="mb-2">
                                <Form.Control disabled defaultValue={description} name="description" />
                            </FloatingLabel>
                            <FloatingLabel label="Comments">
                                <Form.Control disabled defaultValue={comments} name="comments" />
                            </FloatingLabel>
                        </Form>  
                    </Modal.Body>
                </Modal>

                <Tabs
                    defaultActiveKey="active"            
                    id="justify-tab-example"
                    className='mb-3'
                    justify
                >
                    
                    <Tab eventKey="active" title={active}>
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th className='text-center'>Record</th>
                                    <th className='text-center'>Area</th>
                                    <th className='text-center'>Equipment</th>
                                    <th className='text-center'>Type</th>
                                    <th className='text-center'>Description</th>
                                    <th className='text-center'>Comments</th>
                                    <th className='text-center'>Updated</th>
                                    {cookieData.maintenance &&
                                        <th className='text-center'>Actions</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {searchedMaint.map((request, index) => {
                                    if (request.approvedBy && !request.done) {
                                        return (
                                            <tr key={index} request={request}>
                                                <td onClick={() => handleOpenActive(request)} className='text-center'>{request.record}</td>
                                                <td onClick={() => handleOpenActive(request)} className='text-center'>{request.area}</td>
                                                <td onClick={() => handleOpenActive(request)} className='text-center'>{request.equipment}</td>
                                                <td onClick={() => handleOpenActive(request)} className='text-center'>{request.requestType}</td>
                                                <td onClick={() => handleOpenActive(request)}>{request.description}</td>
                                                <td onClick={() => handleOpenActive(request)}>{request.comments}</td>
                                                <td onClick={() => handleOpenActive(request)} className='text-center'>{format(parseISO(request.updatedAt), 'MM/dd h:mm b')}</td>
                                                {cookieData.maintenance && 
                                                    <td>
                                                        <Icon icon={ checkCircleO } size={24} style={{ color: '#5BC236' }} onClick={() => handleDone(request)} />
                                                        <Icon icon={ timesCircleO } size={24} style={{ color: '#CC0202' }} onClick={() => handleDeny(request)}/>
                                                        <Icon icon={ compass } size={24} style={{ color: '#F0D500' }} onClick={() => handleHold(request)}/>
                                                    </td>
                                                }
                                            </tr>
                                        )
                                    }
                                })}
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="request" title={requested}>
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th className='text-center'>Record</th>
                                    <th className='text-center'>Requester</th>
                                    <th className='text-center'>Created</th>
                                    <th className='text-center'>Area</th>
                                    <th className='text-center'>Equipment</th>
                                    <th className='text-center'>Type</th>
                                    <th className='text-center'>Description</th>
                                    <th className='text-center'>Comments</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedMaint.map((request, index) => {
                                    if (!request.approvedBy && !request.hold && !request.done) {
                                        return (
                                            <tr key={index} request={request}>
                                                <td onClick={() => handleOpenUpdate(request)} className='text-center'>{request.record}</td>
                                                <td onClick={() => handleOpenUpdate(request)} className='text-center'>{request.requestedBy}</td>
                                                <td onClick={() => handleOpenUpdate(request)} className='text-center'>{format(parseISO(request.createdAt), 'MM/dd h:mm b')}</td>
                                                <td onClick={() => handleOpenUpdate(request)} className='text-center'>{request.area}</td>
                                                <td onClick={() => handleOpenUpdate(request)} className='text-center'>{request.equipment}</td>
                                                <td onClick={() => handleOpenUpdate(request)} className='text-center'>{request.requestType}</td>
                                                <td onClick={() => handleOpenUpdate(request)}>{request.description}</td>
                                                <td onClick={() => handleOpenUpdate(request)}>{request.comments}</td>
                                                {cookieData.maintenance ? 
                                                    <td className='text-center'>
                                                        <Icon icon={ checkCircleO } size={24} style={{ color: '#5BC236' }} onClick={() => handleApprove(request)} />
                                                        <Icon icon={ timesCircleO } size={24} style={{ color: '#CC0202' }} onClick={() => handleDeny(request)}/>
                                                        <Icon icon={ compass } size={24} style={{ color: '#F0D500' }} onClick={() => handleHold(request)}/>
                                                    </td>
                                                :
                                                    <td onClick={() => handleOpenUpdate(request)} className='text-center'>Pending</td>
                                                }
                                            </tr>
                                        )
                                    }
                                })}
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="hold" title={hold}>
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th className='text-center'>Record</th>
                                    <th className='text-center'>Requester</th>
                                    <th className='text-center'>Area</th>
                                    <th className='text-center'>Equipment</th>
                                    <th className='text-center'>Type</th>
                                    <th className='text-center'>Description</th>
                                    <th className='text-center'>Comments</th>
                                    <th className='text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedMaint.map((request, index) => {
                                    if (!request.approvedBy && request.hold &&!request.done) {
                                        return (
                                            <tr key={index} request={request}>
                                                <td onClick={() => handleOpenUpdate(request)} className='text-center'>{request.record}</td>
                                                <td onClick={() => handleOpenUpdate(request)} className='text-center'>{request.requestedBy}</td>
                                                <td onClick={() => handleOpenUpdate(request)} className='text-center'>{request.area}</td>
                                                <td onClick={() => handleOpenUpdate(request)} className='text-center'>{request.equipment}</td>
                                                <td onClick={() => handleOpenUpdate(request)} className='text-center'>{request.requestType}</td>
                                                <td onClick={() => handleOpenUpdate(request)}>{request.description}</td>
                                                <td onClick={() => handleOpenUpdate(request)}>{request.comments}</td>
                                                <td className='text-center'>
                                                    <Icon icon={ checkCircleO } size={24} style={{ color: '#5BC236' }} onClick={() => handleApprove(request)} />
                                                    <Icon icon={ timesCircleO } size={24} style={{ color: '#CC0202' }} onClick={() => handleDeny(request)}/>
                                                </td>
                                            </tr>
                                        )
                                    }
                                })}
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="completed" title="Completed">
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th className='text-center'>Record</th>
                                    <th className='text-center'>Area</th>
                                    <th className='text-center'>Equipment</th>
                                    <th className='text-center'>Type</th>
                                    <th className='text-center'>Description</th>
                                    <th className='text-center'>Comments</th>
                                    <th className='text-center'>Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedMaint.map((request, index) => {
                                    if (request.done) {
                                        return (
                                            <tr key={index} request={request}>
                                                <td onClick={() => handleOpenComplete(request)} className='text-center'>{request.record}</td>
                                                <td onClick={() => handleOpenComplete(request)} className='text-center'>{request.area}</td>
                                                <td onClick={() => handleOpenComplete(request)} className='text-center'>{request.equipment}</td>
                                                <td onClick={() => handleOpenComplete(request)} className='text-center'>{request.requestType}</td>
                                                <td onClick={() => handleOpenComplete(request)}>{request.description}</td>
                                                <td onClick={() => handleOpenComplete(request)}>{request.comments}</td>
                                                <td onClick={() => handleOpenComplete(request)} className='text-center'>{format(parseISO(request.updatedAt), 'MM/dd h:mm b')}</td>
                                            </tr>
                                        )
                                    }
                                })}
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="schedule" title="Scheduled">
                        <h1>Coming Soon</h1>
                    </Tab>
                </Tabs>
                <button onClick={handleOpenAdd}>Add</button>
            </div>
        }
        </div>
    )
}