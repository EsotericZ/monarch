import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';

import { Icon } from 'react-icons-kit';
import { checkCircleO } from 'react-icons-kit/fa/checkCircleO';
import { timesCircleO } from 'react-icons-kit/fa/timesCircleO';
import { compass } from 'react-icons-kit/fa/compass';

import getAllRequests from '../../services/maintenance/getAllRequests';
import createRequest from '../../services/maintenance/createRequest';
import updateRequest from '../../services/maintenance/updateRequest';
import approveRequest from '../../services/maintenance/approveRequest';
import holdRequest from '../../services/maintenance/holdRequest';

export const Maintenance = () => {
    const [searchedMaint, setSearchedMaint] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [showDeny, setShowDeny] = useState(false);
    const [showHold, setShowHold] = useState(false);
    const [newRequest, setNewRequest] = useState({
        requestedBy: '',
        area: '',
        equipment: '',
        requestType: '',
        description: '',
        comments: '',
    });
    const [updateSingleRequest, setUpdateSingleRequest] = useState({
        requestedBy: '',
        area: '',
        equipment: '',
        requestType: '',
        description: '',
        comments: '',
    });

    const [active, setActive] = useState('');
    const [requested, setRequested] = useState('');
    const [hold, setHold] = useState('');

    const [record, setRecord] = useState('');
    const [requestedBy, setRequestedBy] = useState('');
    const [area, setArea] = useState('');
    const [equipment, setEquipment] = useState('');
    const [requestType, setRequestType] = useState('');
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState('');
    const [requestHold, setRequestHold] = useState(false);
    const [approvedBy, setApprovedBy] = useState('');

    async function fetchData() {
        console.log('Fetching Data')
        try {
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
        .then(console.log('you'))
        .then(setShowUpdate(false))
    };

    const handleApprove = (request) => {
        setRecord(request.record);
        setApprovedBy('CJ')
        setShowApprove(true);
    } 
    const handleApproveNo = () => {
        setApprovedBy('')
        setShowApprove(false);
    }
    const handleApproveYes = () => {
        approveRequest(record, approvedBy);
        setShowApprove(false);
    }
    

    const handleDeny = (request) => {
        setRecord(request.record);
        setShowDeny(true);
        console.log(`${request.record} denied`);
    }

    const handleHold = (request) => {
        setRecord(request.record);
        setRequestHold(true)
        setShowHold(true);
    }
    const handleHoldNo = () => {
        setRequestHold(false)
        setShowHold(false);
    }
    const handleHoldYes = () => {
        holdRequest(record, requestHold);
        setShowHold(false);
    }



    useEffect(() => {
        fetchData();
    }, [showAdd, showUpdate, showApprove, showHold]);

    return loading ?
        <>
            <h1>Loading</h1>
        </>
        :
        <>
            <h1>Maintenance</h1>
            <Modal show={showApprove}>
                <Modal.Header>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Approve Record {record}
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

            <Modal show={showHold}>
                <Modal.Header>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Hold Record {record}
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

            <Modal show={showAdd}>
                <Modal.Header>
                    <Modal.Title>Add Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FloatingLabel label="Requested By" className="mb-2">
                            <Form.Control name="requestedBy" onChange={handleChangeAdd} />
                        </FloatingLabel>
                        <FloatingLabel label="Area" className="mb-2">
                            <Form.Control name="area" onChange={handleChangeAdd} />
                        </FloatingLabel>
                        <FloatingLabel label="Equipment" className="mb-2">
                            <Form.Control name="equipment" onChange={handleChangeAdd} />
                        </FloatingLabel>
                        <FloatingLabel label="Request Type" className="mb-2">
                            <Form.Control name="requestType" onChange={handleChangeAdd} />
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
                    <Modal.Title>Update Record {record}</Modal.Title>
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
            <Tabs
                defaultActiveKey="home"            
                id="justify-tab-example"
                className='mb-3'
                justify
            >
                <Tab eventKey="home" title="Home">
                    <h1>Home</h1>
                </Tab>
                <Tab eventKey="active" title={active}>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Record</th>
                                <th>Area</th>
                                <th>Equipment</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Comments</th>
                                <th>Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchedMaint.map((request, index) => {
                                if (request.approvedBy && !request.done) {
                                    return (
                                        <tr key={index} request={request}>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.record}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.area}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.equipment}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.type}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.description}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.comments}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.updatedAt}</td>
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
                                <th>Record</th>
                                <th>Requester</th>
                                <th>Created</th>
                                <th>Area</th>
                                <th>Equipment</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Comments</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchedMaint.map((request, index) => {
                                if (!request.approvedBy && !request.hold) {
                                    return (
                                        <tr key={index} request={request}>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.record}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.requestedBy}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.createdAt}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.area}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.equipment}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.type}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.description}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.comments}</td>
                                            <td>
                                                <Icon icon={ checkCircleO } size={24} style={{ color: '#5BC236' }} onClick={() => handleApprove(request)} />
                                                <Icon icon={ timesCircleO } size={24} style={{ color: '#CC0202' }} onClick={() => handleDeny(request)}/>
                                                <Icon icon={ compass } size={24} style={{ color: '#F0D500' }} onClick={() => handleHold(request)}/>
                                            </td>
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
                                <th>Record</th>
                                <th>Requester</th>
                                <th>Area</th>
                                <th>Equipment</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Comments</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchedMaint.map((request, index) => {
                                if (!request.approvedBy && request.hold) {
                                    return (
                                        <tr key={index} request={request}>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.record}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.requestedBy}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.area}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.equipment}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.type}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.description}</td>
                                            <td onClick={() => handleOpenUpdate(request)}>{request.comments}</td>
                                            <td>
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
                    <h1>Completed</h1>
                </Tab>
            </Tabs>
            <button onClick={handleOpenAdd}>Add</button>
        </>
}