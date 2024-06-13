import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Table, Toast, ToastContainer } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";

import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/entypo/check';
import { plus } from 'react-icons-kit/fa/plus';

import getAllQCNotes from '../../services/qcinfo/getAllQCNotes';
import createQCNote from '../../services/qcinfo/createQCNote';
import updateQCInfo from '../../services/qcinfo/updateQCInfo';

import { Sidebar } from '../sidebar/Sidebar';

export const QualityInfo = () => {
    const cookies = new Cookies();
    let cookieData
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
            'engineering': false,
        };
    }
    
    const [searchedQC, setSearchedQC] = useState([]);
    const [searchedValueCustCode, setSearchedValueCustCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [copy, setCopy] = useState('None');
    
    const [id, setId] = useState(0);
    const [custCode, setCustCode] = useState('');
    const [coc, setCOC] = useState(false);
    const [matlCert, setMatlCert] = useState(false);
    const [platCert, setPlatCert] = useState(false);
    const [addInfo, setAddInfo] = useState(false);
    const [notes, setNotes] = useState('');
    
    const fetchData = async () => {
        try {
            const results = await getAllQCNotes();
            setSearchedQC(results.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleShow = () => {
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const handleSave = async () => {
        try {
            await createQCNote(custCode, coc, matlCert, platCert, addInfo, notes);
            setShow(false);
            setCustCode('');
            setCOC(false);
            setMatlCert(false);
            setPlatCert(false);
            setAddInfo(false);
            setNotes('');
        } catch (err) {
            console.error(err);
        } finally {
            fetchData();
        }
    };

    const handleOpenItem = (item) => {
        setId(item.id);
        setCustCode(item.custCode);
        setCOC(item.coc);
        setMatlCert(item.matlCert);
        setPlatCert(item.platCert);
        setAddInfo(item.addInfo);
        setNotes(item.notes);
        setShowEdit(true)
    };

    const handleUpdate = async () => {
        try {
            await updateQCInfo(id, custCode, coc, matlCert, platCert, addInfo, notes);
            setId(0);
            setCustCode('');
            setCOC(false);
            setMatlCert(false);
            setPlatCert(false);
            setAddInfo(false);
            setNotes('');
            setShowEdit(false);
        } catch (err) {
            console.error(err);
        } finally {
            fetchData();
        }
    }

    const handleCancel = () => {
        setId(0);
        setCustCode('');
        setCOC(false);
        setMatlCert(false);
        setPlatCert(false);
        setAddInfo(false);
        setNotes('');
        setShowEdit(false);
    }

    useEffect(() => {
        fetchData();
    }, [loading]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Quality Info</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Quality Info</h1>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title className="justify-content-center">Add New</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <Form>
                                <FloatingLabel controlId="floatingInput" label="Customer Code" className="mb-3">
                                    <Form.Control onChange={(e) => {setCustCode(e.target.value)}} />
                                </FloatingLabel>
                                <Form.Group controlId="formBasicCheckbox" className="d-flex align-items-center mb-3" style={{ justifyContent: 'flex-start' }}>
                                    <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Certificate of Conformance Required</Form.Label>
                                    <Form.Check 
                                        type="checkbox" 
                                        onChange={(e) => setCOC(e.target.checked)}
                                        checked={coc}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox" className="d-flex align-items-center mb-3" style={{ justifyContent: 'flex-start' }}>
                                    <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Material Certs Required</Form.Label>
                                    <Form.Check 
                                        type="checkbox" 
                                        onChange={(e) => setMatlCert(e.target.checked)}
                                        checked={matlCert}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox" className="d-flex align-items-center mb-3" style={{ justifyContent: 'flex-start' }}>
                                    <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Plating Certs Required</Form.Label>
                                    <Form.Check 
                                        type="checkbox" 
                                        onChange={(e) => setPlatCert(e.target.checked)}
                                        checked={platCert}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox" className="d-flex align-items-center mb-3" style={{ justifyContent: 'flex-start' }}>
                                    <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">First Article</Form.Label>
                                    <Form.Check 
                                        type="checkbox" 
                                        onChange={(e) => setAddInfo(e.target.checked)}
                                        checked={addInfo}
                                    />
                                </Form.Group>
                                <FloatingLabel controlId="floatingTextarea" label="Notes" className="mb-3">
                                    <Form.Control 
                                        as="textarea" 
                                        rows={4}
                                        onChange={(e) => setNotes(e.target.value)} 
                                    />
                                </FloatingLabel>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className="justify-content-center">
                            <Button className='modalBtnCancel' variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button className='modalBtnVerify' variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showEdit} onHide={handleCancel}>
                        <Modal.Header closeButton>
                            <Modal.Title className="justify-content-center">Update Customer Requirements</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <Form>
                                <FloatingLabel controlId="floatingInput" label="Customer Code" className="mb-3">
                                    <Form.Control defaultValue={custCode} onChange={(e) => {setCustCode(e.target.value)}} />
                                </FloatingLabel>
                                <Form.Group controlId="formBasicCheckbox" className="d-flex align-items-center mb-3" style={{ justifyContent: 'flex-start' }}>
                                    <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Certificate of Conformance Required</Form.Label>
                                    <Form.Check 
                                        type="checkbox" 
                                        onChange={(e) => setCOC(e.target.checked)}
                                        checked={coc}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox" className="d-flex align-items-center mb-3" style={{ justifyContent: 'flex-start' }}>
                                    <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Material Certs Required</Form.Label>
                                    <Form.Check 
                                        type="checkbox" 
                                        onChange={(e) => setMatlCert(e.target.checked)}
                                        checked={matlCert}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox" className="d-flex align-items-center mb-3" style={{ justifyContent: 'flex-start' }}>
                                    <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">Plating Certs Required</Form.Label>
                                    <Form.Check 
                                        type="checkbox" 
                                        onChange={(e) => setPlatCert(e.target.checked)}
                                        checked={platCert}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox" className="d-flex align-items-center mb-3" style={{ justifyContent: 'flex-start' }}>
                                    <Form.Label style={{ fontWeight: 'normal' }} className="me-2 mb-0">First Article</Form.Label>
                                    <Form.Check 
                                        type="checkbox" 
                                        onChange={(e) => setAddInfo(e.target.checked)}
                                        checked={addInfo}
                                    />
                                </Form.Group>
                                <FloatingLabel controlId="floatingInput" label="Notes" className="mb-3">
                                    <Form.Control defaultValue={notes} onChange={(e) => {setNotes(e.target.value)}} />
                                </FloatingLabel>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer className="justify-content-center">
                            <Button className='modalBtnCancel' variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button className='modalBtnVerify' variant="primary" onClick={handleUpdate}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <div className='mx-3'>
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th className='text-center' width='12%'><input onChange={(e) => setSearchedValueCustCode(e.target.value)} placeholder='&#xf002;  Customer Code' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                    <th className='text-center' width='12%'>COC</th>
                                    <th className='text-center' width='12%'>Material Certs</th>
                                    <th className='text-center' width='12%'>Plating Certs</th>
                                    <th className='text-center' width='12%'>First Article</th>
                                    <th className='text-center' width='40%'>Engineering Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedQC
                                    .filter((row) => 
                                        !searchedValueCustCode || row.custCode
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchedValueCustCode.toString().toLowerCase())
                                    )
                                    .map((item, index) => {
                                        return (
                                            <tr key={index} item={item}>
                                                <td onClick={() => handleOpenItem(item)} className='text-center jobBold'>{item.custCode}</td>
                                                <td className='text-center'>
                                                    {item.coc &&
                                                        <Icon icon={check} />
                                                    }
                                                </td>
                                                <td className='text-center'>
                                                    {item.matlCert &&
                                                        <Icon icon={check} />
                                                    }
                                                </td>
                                                <td className='text-center'>
                                                    {item.platCert &&
                                                        <Icon icon={check} />
                                                    }
                                                </td>
                                                <td className='text-center'>
                                                    {item.addInfo &&
                                                        <Icon icon={check} />
                                                    }
                                                </td>
                                                <CopyToClipboard text={item.notes} onCopy={() => { setShowToast(true); setCopy('Engineering Note Copied') }}>
                                                    <td className='text-center'>{item.notes}</td>
                                                </CopyToClipboard>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <ToastContainer className="toastCopy" style={{ zIndex: 1 }}>
                            <Toast bg='success' onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide animation>
                                <Toast.Body>
                                    <strong className="mx-auto me-auto">{copy}</strong>
                                </Toast.Body>
                            </Toast>
                        </ToastContainer>
                        {cookieData.quality &&
                            <Button className='rounded-circle refreshBtn' onClick={() => handleShow()}>
                                <Icon size={24} icon={plus}/>
                            </Button>
                        }
                    </div>
                </div>
            }
        </div>
    )
}