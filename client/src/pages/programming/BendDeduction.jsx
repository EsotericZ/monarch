import { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Modal, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";

import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/entypo/check';
import { plus } from 'react-icons-kit/fa/plus';

import getRecords from '../../services/bendDeduction/getRecords';
import createRecord from '../../services/bendDeduction/createRecord';
import updateRecord from '../../services/bendDeduction/updateRecord';
import { Sidebar } from '../sidebar/Sidebar';

export const BendDeduction= () => {
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

    const [searchedValueSubType, setSearchedValueSubType] = useState('');
    const [searchedValueGauge, setSearchedValueGauge] = useState('');
    const [searchedValueThickness, setSearchedValueThickness] = useState('');
    const [searchedValueRadius, setSearchedValueRadius] = useState('');
    const [searchedValuePunch, setSearchedValuePunch] = useState('');
    const [searchedValueDie, setSearchedValueDie] = useState('');
    const [searchedValueNotes, setSearchedValueNotes] = useState('');
    const [searchedBD, setSearchedBD] = useState([]);

    const [id, setId] = useState(0);
    const [type, setType] = useState('');
    const [subType, setSubType] = useState('');
    const [gauge, setGauge] = useState('');
    const [thickness, setThickness] = useState('');
    const [radius, setRadius] = useState('');
    const [bd, setBD] = useState('');
    const [punch, setPunch] = useState('');
    const [die, setDie] = useState('');
    const [notes, setNotes] = useState('-');
    const [verified, setVerified] = useState(false);
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const [crs, setCRS] = useState('Carbon');
    const [sss, setSSS] = useState('Stainless');
    const [als, setALS] = useState('Aluminum');
    const [custom, setCustom] = useState('Custom');
    const [archive, setArchive] = useState('Archive');

    const fetchData = async () => {
        try {
            const [bdRes] = await Promise.all([
                getRecords()
            ]);

            setSearchedBD(bdRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => setShow(false);

    const handleSave = async () => {
        try {
            await createRecord(type, subType, gauge, thickness, radius, bd, punch, die, notes, true);
            setShow(false);
            setType('');
            setSubType('');
            setGauge('');
            setThickness('');
            setRadius('');
            setBD('');
            setPunch('');
            setDie('');
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

    const handleOpenRecord = (record) => {
        setId(record.id);
        setType(record.type);
        setSubType(record.subType);
        setGauge(record.gauge);
        setThickness(record.thickness);
        setRadius(record.radius);
        setBD(record.bd);
        setPunch(record.punch);
        setDie(record.die);
        setNotes(record.notes);
        setShowEdit(true)
    };

    const handleCancel = () => {
        setId(0);
        setType('');
        setSubType('');
        setGauge('');
        setThickness('');
        setRadius('');
        setBD('');
        setPunch('');
        setDie('');
        setNotes('');
        setShowEdit(false)
    }

    const handleUpdate = async () => {
        try {
            await updateRecord(id, radius, bd, punch, die, notes);
            setId(0);
            setType('');
            setSubType('');
            setGauge('');
            setThickness('');
            setRadius('');
            setBD('');
            setPunch('');
            setDie('');
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
    }, [loading])

    let matlCRS = [
        { gauge: '24Ga', thick: '.023' },
        { gauge: '22Ga', thick: '.030' },
        { gauge: '20Ga', thick: '.035' },
        { gauge: '18Ga', thick: '.048' },
        { gauge: '16Ga', thick: '.060' },
        { gauge: '14Ga', thick: '.074' },
        { gauge: '13Ga', thick: '.090' },
        { gauge: '12Ga', thick: '.104' },
        { gauge: '11Ga', thick: '.120' },
        { gauge: '10Ga', thick: '.135' },
    ];
    
    let matlHRS = [
        { gauge: '7Ga', thick: '.187' },
        { gauge: '1/4', thick: '.250' },
        { gauge: '5/16', thick: '.312' },
        { gauge: '3/8', thick: '.375' },
        { gauge: '1/2', thick: '.500' },
    ];
    
    let matlSSS = [
        { gauge: '24Ga', thick: '.023' },
        { gauge: '22Ga', thick: '.030' },
        { gauge: '20Ga', thick: '.025' },
        { gauge: '18Ga', thick: '.048' },
        { gauge: '16Ga', thick: '.060' },
        { gauge: '14Ga', thick: '.074' },
        { gauge: '13Ga', thick: '.090' },
        { gauge: '12Ga', thick: '.104' },
        { gauge: '11Ga', thick: '.120' },
        { gauge: '10Ga', thick: '.135' },
        { gauge: '8Ga', thick: '.160' },
        { gauge: '7Ga', thick: '.187' },
        { gauge: '1/4', thick: '.250' },
        { gauge: '3/8', thick: '.375' },
    ];

    let matlALS = [
        { gauge: '24Ga', thick: '.020' },
        { gauge: '22Ga', thick: '.023' },
        { gauge: '21Ga', thick: '.028' },
        { gauge: '20Ga', thick: '.032' },
        { gauge: '19Ga', thick: '.035' },
        { gauge: '18Ga', thick: '.040' },
        { gauge: '16Ga', thick: '.050' },
        { gauge: '14Ga', thick: '.060' },
        { gauge: '12Ga', thick: '.080' },
        { gauge: '11Ga', thick: '.090' },
        { gauge: '10Ga', thick: '.100' },
        { gauge: '8Ga', thick: '.125' },
        { gauge: '5Ga', thick: '.187' },
        { gauge: '1/4', thick: '.250' },
    ];

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Bend Deduction</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center'>Bend Deduction</h1>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title className="justify-content-center">Add Bend Deduction</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <Form>
                                <FloatingLabel label="Type" className="mb-3">
                                    <Form.Control as="select" name="Type" onChange={(e) => {setType(e.target.value)}}>
                                        <option> </option>
                                        <option>Carbon</option>
                                        <option>Stainless</option>
                                        <option>Aluminum</option>
                                        <option>Custom</option>
                                    </Form.Control>
                                </FloatingLabel>
                                {type == 'Carbon' &&
                                    <FloatingLabel label="Sub Type" className="mb-3">
                                        <Form.Control as="select" name="Sub Type" onChange={(e) => {setSubType(e.target.value)}}>
                                            <option> </option>
                                            <option>CRS</option>
                                            <option>HRS</option>
                                            <option>GALV</option>
                                        </Form.Control>
                                    </FloatingLabel>
                                }
                                {type == 'Stainless' &&
                                    <FloatingLabel label="Sub Type" className="mb-3">
                                        <Form.Control as="select" name="Sub Type" onChange={(e) => {setSubType(e.target.value)}}>
                                            <option> </option>
                                            <option>304</option>
                                            <option>316</option>
                                            <option>316TI</option>
                                        </Form.Control>
                                    </FloatingLabel>
                                }
                                {type == 'Aluminum' &&
                                    <FloatingLabel label="Sub Type" className="mb-3">
                                        <Form.Control as="select" name="Sub Type" onChange={(e) => {setSubType(e.target.value)}}>
                                            <option> </option>
                                            <option>5052</option>
                                            <option>5754</option>
                                            <option>6061</option>
                                        </Form.Control>
                                    </FloatingLabel>
                                }
                                {type == 'Custom' &&
                                    <FloatingLabel label="Sub Type" className="mb-3">
                                        <Form.Control as="select" name="Sub Type" onChange={(e) => {setSubType(e.target.value)}}>
                                            <option> </option>
                                            <option>Brass</option>
                                            <option>Copper</option>
                                            <option>Lexan</option>
                                        </Form.Control>
                                    </FloatingLabel>
                                }

                                {(subType == 'CRS' || subType == 'GALV') && (
                                    <>
                                        <FloatingLabel label="Gauge" className="mb-3">
                                            <Form.Control as="select" name="Gauge" onChange={(e) => {
                                                const selectedGauge = e.target.value;
                                                setGauge(selectedGauge);
                                                const selectedMatl = matlCRS.find(matl => matl.gauge === selectedGauge);
                                                if (selectedMatl) {
                                                    setThickness(selectedMatl.thick);
                                                }
                                            }}>
                                                <option> </option>
                                                {matlCRS.map((matl, index) => (
                                                    <option key={index}>{matl.gauge}</option>
                                                ))}
                                            </Form.Control>
                                        </FloatingLabel>
                                        <FloatingLabel controlId="floatingInput" label="Thickness" className="mb-3">
                                            <Form.Control disabled value={thickness} onChange={(e) => {setThickness(e.target.value)}} />
                                        </FloatingLabel>
                                    </>
                                )}

                                {subType == 'HRS' && (
                                    <>
                                        <FloatingLabel label="Gauge" className="mb-3">
                                            <Form.Control as="select" name="Gauge" onChange={(e) => {
                                                const selectedGauge = e.target.value;
                                                setGauge(selectedGauge);
                                                const selectedMatl = matlHRS.find(matl => matl.gauge === selectedGauge);
                                                if (selectedMatl) {
                                                    setThickness(selectedMatl.thick);
                                                }
                                            }}>
                                                <option> </option>
                                                {matlHRS.map((matl, index) => (
                                                    <option key={index}>{matl.gauge}</option>
                                                ))}
                                            </Form.Control>
                                        </FloatingLabel>
                                        <FloatingLabel controlId="floatingInput" label="Thickness" className="mb-3">
                                            <Form.Control disabled value={thickness} onChange={(e) => {setThickness(e.target.value)}} />
                                        </FloatingLabel>
                                    </>
                                )}

                                {(subType == '304' || subType == '316' || subType == '316TI') && (
                                    <>
                                        <FloatingLabel label="Gauge" className="mb-3">
                                            <Form.Control as="select" name="Gauge" onChange={(e) => {
                                                const selectedGauge = e.target.value;
                                                setGauge(selectedGauge);
                                                const selectedMatl = matlSSS.find(matl => matl.gauge === selectedGauge);
                                                if (selectedMatl) {
                                                    setThickness(selectedMatl.thick);
                                                }
                                            }}>
                                                <option> </option>
                                                {matlSSS.map((matl, index) => (
                                                    <option key={index}>{matl.gauge}</option>
                                                ))}
                                            </Form.Control>
                                        </FloatingLabel>
                                        <FloatingLabel controlId="floatingInput" label="Thickness" className="mb-3">
                                            <Form.Control disabled value={thickness} onChange={(e) => {setThickness(e.target.value)}} />
                                        </FloatingLabel>
                                    </>
                                )}

                                {(subType == '5052' || subType == '5754' || subType == '6061') && (
                                    <>
                                        <FloatingLabel label="Thickness" className="mb-3">
                                            <Form.Control as="select" name="Thickness" onChange={(e) => {
                                                const selectedThick = e.target.value;
                                                setThickness(selectedThick);
                                                const selectedMatl = matlALS.find(matl => matl.thick === selectedThick);
                                                if (selectedMatl) {
                                                    setGauge(selectedMatl.gauge);
                                                }
                                            }}>
                                                <option> </option>
                                                {matlALS.map((matl, index) => (
                                                    <option key={index}>{matl.thick}</option>
                                                ))}
                                            </Form.Control>
                                        </FloatingLabel>
                                        <FloatingLabel controlId="floatingInput" label="Gauge" className="mb-3">
                                            <Form.Control disabled value={gauge} onChange={(e) => {setGauge(e.target.value)}} />
                                        </FloatingLabel>
                                    </>
                                )}
                                
                                {(subType == 'Brass' || subType == 'Copper' || subType == 'Lexan') && (
                                    <FloatingLabel controlId="floatingInput" label="Thickness" className="mb-3">
                                        <Form.Control onChange={(e) => {setThickness(e.target.value)}} />
                                    </FloatingLabel>
                                )}

                                <div className="row">
                                    <div className="col-md-6">
                                        <FloatingLabel controlId="floatingInput" label="Radius" className="mb-3">
                                            <Form.Control as="select" name="Radius" onChange={(e) => {setRadius(e.target.value)}}>
                                                <option> </option>
                                                <option>.031</option>
                                                <option>.039</option>
                                                <option>.060</option>
                                                <option>.090</option>
                                                <option>.125</option>
                                                <option>.172</option>
                                                <option>.190</option>
                                                <option>.210</option>
                                                <option>.236</option>
                                                <option>.250</option>
                                                <option>.375</option>
                                                <option>.393</option>
                                                <option>.500</option>
                                                <option>1.000</option>
                                            </Form.Control>
                                        </FloatingLabel>
                                    </div>
                                    <div className="col-md-6">
                                        <FloatingLabel controlId="floatingInput" label="Bend Deduction" className="mb-3">
                                            <Form.Control onChange={(e) => {setBD(e.target.value)}} />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <FloatingLabel controlId="floatingInput" label="Punch Tooling" className="mb-3">
                                    <Form.Control onChange={(e) => {setPunch(e.target.value)}} />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInput" label="Die Tooling" className="mb-3">
                                    <Form.Control onChange={(e) => {setDie(e.target.value)}} />
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
                            {(radius && bd && thickness && punch && die) ?
                                <Button className='modalBtnVerify' variant="primary" onClick={handleSave}>
                                    Save
                                </Button>
                            :
                                <Button disabled className='modalBtnVerify' style={{ backgroundColor: '#808080', borderColor: '#A9A9A9' }} variant="primary" onClick={handleSave}>
                                    -
                                </Button>
                            }
                        </Modal.Footer>
                    </Modal>
                    
                    <Modal show={showEdit} onHide={handleCancel}>
                        <Modal.Header closeButton>
                            <Modal.Title className="justify-content-center">Update Bend Deduction</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <Form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <FloatingLabel label="Type" className="mb-3">
                                            <Form.Control disabled defaultValue={type} />
                                        </FloatingLabel>
                                    </div>
                                    <div className="col-md-6">
                                        <FloatingLabel label="Sub Type" className="mb-3">
                                            <Form.Control disabled defaultValue={subType} />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <FloatingLabel label="Gauge" className="mb-3">
                                            <Form.Control disabled defaultValue={gauge} />
                                        </FloatingLabel>
                                    </div>
                                    <div className="col-md-6">
                                        <FloatingLabel label="Thickness" className="mb-3">
                                            <Form.Control disabled defaultValue={thickness} />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <FloatingLabel controlId="floatingInput" label="Radius" className="mb-3">
                                            <Form.Control defaultValue={radius} onChange={(e) => {setRadius(e.target.value)}} />
                                        </FloatingLabel>
                                    </div>
                                    <div className="col-md-6">
                                        <FloatingLabel controlId="floatingInput" label="Bend Deduction" className="mb-3">
                                            <Form.Control defaultValue={bd} onChange={(e) => {setBD(e.target.value)}} />
                                        </FloatingLabel>
                                    </div>
                                </div>
                                <FloatingLabel controlId="floatingInput" label="Punch Tooling" className="mb-3">
                                    <Form.Control defaultValue={punch} onChange={(e) => {setPunch(e.target.value)}} />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInput" label="Die Tooling" className="mb-3">
                                    <Form.Control defaultValue={die} onChange={(e) => {setDie(e.target.value)}} />
                                </FloatingLabel>
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

                    <Tabs
                        defaultActiveKey="crs"
                        id="justify-tab-example"
                        className='mb-3'
                        justify
                    >
                        <Tab eventKey="crs" title={crs}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueGauge(e.target.value)} placeholder='&#xf002;  Gauge' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueThickness(e.target.value)} placeholder='&#xf002;  Thickness' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueRadius(e.target.value)} placeholder='&#xf002;  Radius' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Bend Deduction</th>
                                            <th className='text-center' width='18%'><input onChange={(e) => setSearchedValuePunch(e.target.value)} placeholder='&#xf002;  Punch Tool' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='18%'><input onChange={(e) => setSearchedValueDie(e.target.value)} placeholder='&#xf002;  Die Tool' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='23%'><input onChange={(e) => setSearchedValueNotes(e.target.value)} placeholder='&#xf002;  Notes' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedBD
                                            .filter((row) => 
                                                !searchedValueGauge || row.gauge
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueGauge.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueThickness || row.thickness
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueThickness.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueRadius || row.radius
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueRadius.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePunch || row.punch
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePunch.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueDie || row.die
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueDie.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueNotes || row.notes
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueNotes.toString().toLowerCase())
                                            )
                                            .map((record, index) => {
                                                if (record.verified && record.type == 'Carbon') {
                                                    return (
                                                        <tr key={index} record={record}>
                                                            {cookieData.forming ?
                                                                <td className='text-center' onClick={() => handleOpenRecord(record)}>{record.gauge}</td>
                                                            :
                                                                <td className='text-center'>{record.gauge}</td>
                                                            }
                                                            <td className='text-center'>{record.thickness}</td>
                                                            <td className='text-center'>{record.radius}</td>
                                                            <td className='text-center'>{record.bd}</td>
                                                            <td className='text-center'>{record.punch}</td>
                                                            <td className='text-center'>{record.die}</td>
                                                            <td className='text-center'>{record.notes}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                {cookieData.forming &&
                                    <Button className='rounded-circle refreshBtn' onClick={() => handleShow()}>
                                        <Icon size={24} icon={plus}/>
                                    </Button>
                                }
                            </div>
                        </Tab>

                        <Tab eventKey="sss" title={sss}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueGauge(e.target.value)} placeholder='&#xf002;  Gauge' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueThickness(e.target.value)} placeholder='&#xf002;  Thickness' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueRadius(e.target.value)} placeholder='&#xf002;  Radius' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Bend Deduction</th>
                                            <th className='text-center' width='18%'><input onChange={(e) => setSearchedValuePunch(e.target.value)} placeholder='&#xf002;  Punch Tool' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='18%'><input onChange={(e) => setSearchedValueDie(e.target.value)} placeholder='&#xf002;  Die Tool' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='23%'><input onChange={(e) => setSearchedValueNotes(e.target.value)} placeholder='&#xf002;  Notes' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedBD
                                            .filter((row) => 
                                                !searchedValueGauge || row.gauge
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueGauge.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueThickness || row.thickness
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueThickness.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueRadius || row.radius
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueRadius.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePunch || row.punch
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePunch.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueDie || row.die
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueDie.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueNotes || row.notes
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueNotes.toString().toLowerCase())
                                            )
                                            .map((record, index) => {
                                                if (record.verified && record.type == 'Stainless') {
                                                    return (
                                                        <tr key={index} record={record}>
                                                            {cookieData.forming ?
                                                                <td className='text-center' onClick={() => handleOpenRecord(record)}>{record.gauge}</td>
                                                            :
                                                                <td className='text-center'>{record.gauge}</td>
                                                            }
                                                            <td className='text-center'>{record.thickness}</td>
                                                            <td className='text-center'>{record.radius}</td>
                                                            <td className='text-center'>{record.bd}</td>
                                                            <td className='text-center'>{record.punch}</td>
                                                            <td className='text-center'>{record.die}</td>
                                                            <td className='text-center'>{record.notes}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                {cookieData.forming &&
                                    <Button className='rounded-circle refreshBtn' onClick={() => handleShow()}>
                                        <Icon size={24} icon={plus}/>
                                    </Button>
                                }
                            </div>
                        </Tab>

                        <Tab eventKey="als" title={als}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueGauge(e.target.value)} placeholder='&#xf002;  Gauge' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueThickness(e.target.value)} placeholder='&#xf002;  Thickness' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueRadius(e.target.value)} placeholder='&#xf002;  Radius' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Bend Deduction</th>
                                            <th className='text-center' width='18%'><input onChange={(e) => setSearchedValuePunch(e.target.value)} placeholder='&#xf002;  Punch Tool' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='18%'><input onChange={(e) => setSearchedValueDie(e.target.value)} placeholder='&#xf002;  Die Tool' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='23%'><input onChange={(e) => setSearchedValueNotes(e.target.value)} placeholder='&#xf002;  Notes' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedBD
                                            .filter((row) => 
                                                !searchedValueGauge || row.gauge
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueGauge.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueThickness || row.thickness
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueThickness.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueRadius || row.radius
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueRadius.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePunch || row.punch
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePunch.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueDie || row.die
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueDie.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueNotes || row.notes
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueNotes.toString().toLowerCase())
                                            )
                                            .map((record, index) => {
                                                if (record.verified && record.type == 'Aluminum') {
                                                    return (
                                                        <tr key={index} record={record}>
                                                            {cookieData.forming ?
                                                                <td className='text-center' onClick={() => handleOpenRecord(record)}>{record.gauge}</td>
                                                            :
                                                                <td className='text-center'>{record.gauge}</td>
                                                            }
                                                            <td className='text-center'>{record.thickness}</td>
                                                            <td className='text-center'>{record.radius}</td>
                                                            <td className='text-center'>{record.bd}</td>
                                                            <td className='text-center'>{record.punch}</td>
                                                            <td className='text-center'>{record.die}</td>
                                                            <td className='text-center'>{record.notes}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                {cookieData.forming &&
                                    <Button className='rounded-circle refreshBtn' onClick={() => handleShow()}>
                                        <Icon size={24} icon={plus}/>
                                    </Button>
                                }
                            </div>
                        </Tab>

                        <Tab eventKey="custom" title={custom}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueGauge(e.target.value)} placeholder='&#xf002;  Gauge' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueThickness(e.target.value)} placeholder='&#xf002;  Thickness' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueRadius(e.target.value)} placeholder='&#xf002;  Radius' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Bend Deduction</th>
                                            <th className='text-center' width='18%'><input onChange={(e) => setSearchedValuePunch(e.target.value)} placeholder='&#xf002;  Punch Tool' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='18%'><input onChange={(e) => setSearchedValueDie(e.target.value)} placeholder='&#xf002;  Die Tool' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='23%'><input onChange={(e) => setSearchedValueNotes(e.target.value)} placeholder='&#xf002;  Notes' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedBD
                                            .filter((row) => 
                                                !searchedValueGauge || row.gauge
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueGauge.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueThickness || row.thickness
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueThickness.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueRadius || row.radius
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueRadius.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePunch || row.punch
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePunch.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueDie || row.die
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueDie.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueNotes || row.notes
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueNotes.toString().toLowerCase())
                                            )
                                            .map((record, index) => {
                                                if (record.verified && record.type == 'Custom') {
                                                    return (
                                                        <tr key={index} record={record}>
                                                            {cookieData.forming ?
                                                                <td className='text-center' onClick={() => handleOpenRecord(record)}>{record.gauge}</td>
                                                            :
                                                                <td className='text-center'>{record.gauge}</td>
                                                            }
                                                            <td className='text-center'>{record.thickness}</td>
                                                            <td className='text-center'>{record.radius}</td>
                                                            <td className='text-center'>{record.bd}</td>
                                                            <td className='text-center'>{record.punch}</td>
                                                            <td className='text-center'>{record.die}</td>
                                                            <td className='text-center'>{record.notes}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                {cookieData.forming &&
                                    <Button className='rounded-circle refreshBtn' onClick={() => handleShow()}>
                                        <Icon size={24} icon={plus}/>
                                    </Button>
                                }
                            </div>
                        </Tab>

                        <Tab eventKey="archive" title={archive}>
                            <div className='mx-3'>
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th className='text-center' width='11%'><input onChange={(e) => setSearchedValueGauge(e.target.value)} placeholder='&#xf002;  Gauge' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueSubType(e.target.value)} placeholder='&#xf002;  Sub Type' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueThickness(e.target.value)} placeholder='&#xf002;  Thickness' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueRadius(e.target.value)} placeholder='&#xf002;  Radius' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='10%'>Bend Deduction</th>
                                            <th className='text-center' width='18%'><input onChange={(e) => setSearchedValuePunch(e.target.value)} placeholder='&#xf002;  Punch Tool' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='18%'><input onChange={(e) => setSearchedValueDie(e.target.value)} placeholder='&#xf002;  Die Tool' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                            <th className='text-center' width='23%'><input onChange={(e) => setSearchedValueNotes(e.target.value)} placeholder='&#xf002;  Notes' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedBD
                                            .filter((row) => 
                                                !searchedValueGauge || row.gauge
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueGauge.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueSubType || row.subType
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueSubType.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueThickness || row.thickness
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueThickness.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueRadius || row.radius
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueRadius.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValuePunch || row.punch
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValuePunch.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueDie || row.die
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueDie.toString().toLowerCase())
                                            )
                                            .filter((row) => 
                                                !searchedValueNotes || row.notes
                                                    .toString()
                                                    .toLowerCase()
                                                    .includes(searchedValueNotes.toString().toLowerCase())
                                            )
                                            .map((record, index) => {
                                                if (!record.verified) {
                                                    return (
                                                        <tr key={index} record={record}>
                                                            {cookieData.forming ?
                                                                <td className='text-center' onClick={() => handleOpenRecord(record)}>{record.gauge}</td>
                                                            :
                                                                <td className='text-center'>{record.gauge}</td>
                                                            }
                                                            <td className='text-center'>{record.subType}</td>
                                                            <td className='text-center'>{record.thickness}</td>
                                                            <td className='text-center'>{record.radius}</td>
                                                            <td className='text-center'>{record.bd}</td>
                                                            <td className='text-center'>{record.punch}</td>
                                                            <td className='text-center'>{record.die}</td>
                                                            <td className='text-center'>{record.notes}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </Table>
                                {cookieData.forming &&
                                    <Button className='rounded-circle refreshBtn' onClick={() => handleShow()}>
                                        <Icon size={24} icon={plus}/>
                                    </Button>
                                }
                            </div>
                        </Tab>

                    </Tabs>
                </div>
            }
        </div>
    )
}