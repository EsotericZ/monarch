import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';

import getAllJobs from '../../services/engineering/getJobs';
import updateJob from '../../services/engineering/updateJob';

const Engineering = () => {
    const [searchedEng, setSearchedEng] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const [jobNoInfo, setJobNoInfo] = useState();
    const [custInfo, setCustInfo] = useState();
    const [partNoInfo, setParNoInfo] = useState();
    const [engineerInfo, setEngineerInfo] = useState();

    const handleClose = () => setShow(false);

    const handleSave = () => {
        updateJob(jobNoInfo, engineerInfo)
        setShow(false);
    };

    const handleShow = (job) => {
        setShow(true);
        setJobNoInfo(job.JobNo)
        setCustInfo(job.CustCode)
        setParNoInfo(job.PartNo)
        setEngineerInfo(job.dataValues.engineer)
    } ;
    
    useEffect(() => {
        const find = () => {
            try {
                let data = getAllJobs();
                data.then((res) => {
                    setSearchedEng(res)
                    setLoading(false)
                })
            } catch (err) {
                console.log(err)
            }
        };
        find();
    }, []);

    return loading ?
        <>
            <h1>Welcome</h1>
            <h2>Loading</h2>
        </>
        :
        <>
            <h1>Welcome</h1>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{jobNoInfo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <FloatingLabel label="Customer Code" className="mb-3">
                        <Form.Control defaultValue={custInfo} disabled />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingInput" label="Engineer" className="mb-3">
                        <Form.Control placeholder="Engineer" defaultValue={engineerInfo} onChange={(e) => {setEngineerInfo(e.target.value)}} />
                    </FloatingLabel>
                    {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Customer</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder={custInfo}
                        autoFocus
                    />
                    </Form.Group>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                    <Form.Label>Example textarea</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                    </Form.Group> */}
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
            <table>
                <tbody>
                {searchedEng.map((job, index) => {
                    return (
                        <tr key={index} job={job} onClick={() => handleShow(job)}>
                            <td>{job.JobNo}</td>
                            <td>{job.PartNo}</td>
                            <td>{job.Revision}</td>
                            <td>{job.EstimQty}</td>
                            <td>{job.DueDate}</td>
                            <td>{job.CustCode}</td>
                            <td>{job.User_Text3}</td>
                            <td>{job.User_Text2}</td>
                            <td>{job.User_Number3}</td>
                            <td>{job.OrderNo}</td>
                            <td>{job.dataValues.engineer}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </>
}

export default Engineering;