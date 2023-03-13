import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';

import getAllRequests from '../../services/maintenance/getAllRequests';
import createRequest from '../../services/maintenance/createRequest';

const Maintenance = () => {
    const [searchedMaint, setSearchedMaint] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [newRequest, setNewRequest] = useState({
        requestedBy: '',
        area: '',
        equipment: '',
        requestType: '',
        description: '',
        comments: '',
    });
    const [updateRequest, setUpdateRequest] = useState({
        requestedBy: '',
        area: '',
        equipment: '',
        requestType: '',
        description: '',
        comments: '',
    });

    const [record, setRecord] = useState('');
    const [requestedBy, setRequestedBy] = useState('');
    const [area, setArea] = useState('');
    const [equipment, setEquipment] = useState('');
    const [requestType, setRequestType] = useState('');
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState('');

    async function fetchData() {
        console.log('Fetching Data')
        try {
            let data = getAllRequests();
            data.then((res) => {
                setSearchedMaint(res.data);
                setLoading(false);
            })
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
        .then(console.log('you'))
        .then(setShowAdd(false))
    };

    const handleChangeUpdate = (e) => {
        const { name, value } = e.target;
        setUpdateRequest((prev) => {
            return {...prev, [name]: value}
        });
    };

    const handleOpenUpdate = (request) => {
        setUpdateRequest({
            ...updateRequest,
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
        console.log(updateRequest)
        // createRequest(newRequest)
        // .then(fetchData())
        // .then(console.log('you'))
        // .then(setShowAdd(false))
        console.log('hit', record)
    };

    useEffect(() => {
        fetchData();
    }, [showAdd, showUpdate]);

    return loading ?
        <>
            <h1>Loading</h1>
        </>
        :
        <>
            <h1>Maintenance</h1>
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
            <table>
                <thead>
                    <tr>
                        <th onClick={handleOpenAdd}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {searchedMaint.map((request, index) => {
                        return (
                            <tr key={index} request={request} onClick={() => handleOpenUpdate(request)}>
                                <td>{request.record}</td>
                                <td>{request.requestedBy}</td>
                                <td>{request.description}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
}

export default Maintenance;