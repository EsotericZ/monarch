import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Table } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/fa/plus'

import getStandardTaps from '../../services/taps/getStandardTaps';
import getMetricTaps from '../../services/taps/getMetricTaps';
import createTap from '../../services/taps/createTap';
import updateTap from '../../services/taps/updateTap';

import { Sidebar } from '../sidebar/Sidebar';

export const TapChart = () => {
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

    const [searchedValueTapStandard, setSearchedValueTapStandard] = useState('');
    const [searchedValueTapMetric, setSearchedValueTapMetric] = useState('');
    const [searchedStandard, setSearchedStandard] = useState([]);
    const [searchedMetric, setSearchedMetric] = useState([]);
    const [tapName, setTapName] = useState('');
    const [holeSize, setHoleSize] = useState('');
    const [type, setType] = useState('Standard');
    const [notes, setNotes] = useState('-');
    const [id, setId] = useState(0);
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            const [standardRes, metricRes] = await Promise.all([
                getStandardTaps(),
                getMetricTaps(),
            ]);

            setSearchedStandard(standardRes.data);
            setSearchedMetric(metricRes.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => setShow(false);

    const handleSave = async () => {
        try {
            await createTap(tapName, holeSize, type, notes);
            setShow(false);
            setTapName('');
            setHoleSize('');
            setType('Standard');
            setNotes('-');
        } catch (err) {
            console.error(err);
        } finally {
            fetchData();
        }
    };

    const handleShow = () => {
        setShow(true);
    };

    const handleOpenTap = (tap) => {
        setId(tap.id);
        setTapName(tap.tapName);
        setHoleSize(tap.holeSize);
        setType(tap.type);
        setNotes(tap.notes);
        setShowEdit(true)
    };

    const handleCancel = () => {
        setTapName('');
        setHoleSize('');
        setType('');
        setNotes('');
        setShowEdit(false);
    }

    const handleUpdate = async () => {
        try {
            await updateTap(id, tapName, holeSize, type, notes);
            setId(0);
            setTapName('');
            setHoleSize('');
            setType('');
            setNotes('');
            setShowEdit(false);
        } catch (err) {
            console.error(err);
        } finally {
            fetchData();
        }
    }

    useEffect(() => {
        fetchData();
    }, [loading]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Engineering</h1>
                    <h2 className='text-center'>Loading</h2>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Tap Chart</h1>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title className="justify-content-center">Add Tap</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <Form>
                                <FloatingLabel label="Tap Name" className="mb-3">
                                    <Form.Control onChange={(e) => {setTapName(e.target.value)}} />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInput" label="Hole Size" className="mb-3">
                                    <Form.Control onChange={(e) => {setHoleSize(e.target.value)}} />
                                </FloatingLabel>
                                <FloatingLabel label="Type" className="mb-3">
                                    <Form.Control as="select" name="Type" onChange={(e) => {setType(e.target.value)}}>
                                        <option>Standard</option>
                                        <option>Metric</option>
                                    </Form.Control>
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInput" label="Notes" className="mb-3">
                                    <Form.Control onChange={(e) => {setNotes(e.target.value)}} />
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

                    <Modal show={showEdit}>
                        <Modal.Header>
                            <Modal.Title>Update Tap</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FloatingLabel label="Tap Name" className="mb-3">
                                <Form.Control defaultValue={tapName} onChange={(e) => {setTapName(e.target.value)}} />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingInput" label="Hole Size" className="mb-3">
                                <Form.Control defaultValue={holeSize} onChange={(e) => {setHoleSize(e.target.value)}} />
                            </FloatingLabel>
                            <FloatingLabel label="Type" className="mb-3">
                                <Form.Control defaultValue={type} as="select" name="Type" onChange={(e) => {setType(e.target.value)}}>
                                    <option>Standard</option>
                                    <option>Metric</option>
                                </Form.Control>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingInput" label="Notes" className="mb-3">
                                <Form.Control defaultValue={notes} onChange={(e) => {setNotes(e.target.value)}} />
                            </FloatingLabel>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className='modalBtnCancel' variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button className='modalBtnVerify' variant="primary" onClick={handleUpdate}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <div  style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                        <div style={{ width: '45%' }}>
                            <h2 className='text-center'>Standard</h2>
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th className='text-center'><input onChange={(e) => setSearchedValueTapStandard(e.target.value)} placeholder='&#xf002;  Tap' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        <th className='text-center'>Hole</th>
                                        <th className='text-center'>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedStandard
                                        .filter((row) => 
                                            !searchedValueTapStandard || row.tapName
                                                .toString()
                                                .toLowerCase()
                                                .includes(searchedValueTapStandard.toString().toLowerCase())
                                        )
                                        .map((tap, index) => {
                                            return (
                                                <tr key={index} tap={tap}>
                                                    <td onClick={() => handleOpenTap(tap)} className='text-center jobBold'>{tap.tapName}</td>
                                                    <td className='text-center'>{tap.holeSize}</td>
                                                    <td className='text-center'>{tap.notes}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                        <div style={{ width: '45%' }}>
                            <h2 className='text-center'>Metric</h2>
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th className='text-center'><input onChange={(e) => setSearchedValueTapMetric(e.target.value)} placeholder='&#xf002;  Tap' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        <th className='text-center'>Hole</th>
                                        <th className='text-center'>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedMetric
                                        .filter((row) => 
                                            !searchedValueTapMetric || row.tapName
                                                .toString()
                                                .toLowerCase()
                                                .includes(searchedValueTapMetric.toString().toLowerCase())
                                        )
                                        .map((tap, index) => {
                                            return (
                                                <tr key={index} tap={tap}>
                                                    <td onClick={() => handleOpenTap(tap)} className='text-center jobBold'>{tap.tapName}</td>
                                                    <td className='text-center'>{tap.holeSize}</td>
                                                    <td className='text-center'>{tap.notes}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <Button className='rounded-circle refreshBtn' onClick={() => handleShow()}>
                        <Icon size={24} icon={plus}/>
                    </Button>
                </div>
            }
        </div>
    )
}