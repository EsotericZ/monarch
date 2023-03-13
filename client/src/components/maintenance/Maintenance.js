import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';

import getAllRequests from '../../services/maintenance/getAllRequests';
import createRequest from '../../services/maintenance/createRequest';

const Maintenance = () => {
    const [searchedMaint, setSearchedMain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [newRequest, setNewRequest] = useState({
        requestedBy: '',
        area: '',
        equipment: '',
        requestType: '',
        description: '',
        comments: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRequest((prev) => {
            return {...prev, [name]: value}
        });
    };

    useEffect(() => {
        try {
            let data = getAllRequests();
            data.then((res) => {
                setSearchedMain(res.data);
                setLoading(false);
            })
        } catch (err) {
            console.log(err);
        }
    }, []);

    const handleOpen = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleSave = () => {
        console.log(newRequest);
        createRequest(newRequest);
        setShow(false);
        try {
            let data = getAllRequests();
            data.then((res) => {
                setSearchedMain(res.data);
                setLoading(false);
            })
        } catch (err) {
            console.log(err);
        }
    };

    return loading ?
        <>
            <h1>Loading</h1>
        </>
        :
        <>
            <h1>Welcome</h1>
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>Add Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FloatingLabel label="Requested By" className="mb-3">
                            <Form.Control name="requestedBy" onChange={handleChange} />
                        </FloatingLabel>
                        <FloatingLabel label="Description" className="mb-3">
                            <Form.Control name="description" onChange={handleChange} />
                        </FloatingLabel>
                        <FloatingLabel label="Area">
                            <Form.Control name="area" onChange={handleChange} />
                        </FloatingLabel>
                    </Form>  
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <table>
                <thead>
                    <tr>
                        <th onClick={handleOpen}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {searchedMaint.map((request, index) => {
                        return (
                            <tr key={index} request={request}>
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