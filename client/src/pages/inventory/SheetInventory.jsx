import { useState } from 'react';
import { Button, Table } from 'react-bootstrap';

import { Sidebar } from '../sidebar/Sidebar';

import getAllPOsDate from '../../services/sheetInventory/getAllPOsDate';
import getAllPOsPO from '../../services/sheetInventory/getAllPOsPO';

export const SheetInventory = () => {
    const [poNum, setPoNum] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dataFetched, setDataFetched] = useState(false);
    const [poData, setPoData] = useState([]);

    const fetchPONum = async () => {
        try {
            const res = await getAllPOsPO(poNum);
            setPoData(res);
            setDataFetched(true);
        } catch (err) {
            console.error(err);
        }
    }

    const fetchPODate = async () => {
        try {
            const res = await getAllPOsDate(startDate, endDate);
            setPoData(res);
            setDataFetched(true);
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setDataFetched(false);
        setPoData([]);
        setPoNum(''); 
        setStartDate('');
        setEndDate('');
    };

    const totalEstSqFt = poData.reduce((sum, item) => sum + (item.MaterialQty * item.JobQty), 0).toFixed(2);
    const totalActSqFt = poData.reduce((sum, item) => sum + item.ActualSQFTJob, 0).toFixed(2);
    const totalDifference = (totalEstSqFt - totalActSqFt).toFixed(2);
    const totalPercentageDiff = ((totalDifference / totalEstSqFt) * 100).toFixed(1);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                <h1 className='text-center m-3'>Sheet Inventory</h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <div className='mx-3' style={{ textAlign: 'center', marginTop: '50px' }}>
                        {!dataFetched ? (
                            <div style={{ width: 'fit-content', marginTop: '20px' }}>
                                <div className="form-group mt-3" style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        className='input form-control mt-1'
                                        type='text'
                                        placeholder='PO Number'
                                        onChange={(e) => setPoNum(e.target.value)}
                                        style={{ marginRight: '10px' }}
                                    />
                                    <Button className='vtiger' onClick={fetchPONum}>
                                        Submit
                                    </Button>
                                </div>

                                <div className="form-group mt-3" style={{ display: 'flex', alignItems: 'center', paddingTop: '40px' }}>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="form-control"
                                        style={{ marginRight: '10px' }}
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="form-control"
                                        style={{ marginRight: '10px' }}
                                    />
                                    <Button className='vtiger' onClick={fetchPODate}>
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ width: '100%', marginTop: '20px' }}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>PO Number</th>
                                            <th>Job No</th>
                                            <th>Part No</th>
                                            <th>Material</th>
                                            <th>Est Sq Ft</th>
                                            <th>Act Sq Ft</th>
                                            <th>+ / -</th>
                                            <th>%</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poData.map((item, index) => {
                                            const EstimatedSQFTJob = (item.MaterialQty * item.JobQty).toFixed(2);
                                            const difference = (EstimatedSQFTJob - item.ActualSQFTJob).toFixed(2);
                                            const percentageDiff = ((difference / EstimatedSQFTJob) * 100).toFixed(1);

                                            return (
                                                <tr key={index}>
                                                    <td>{item.PONo}</td>
                                                    <td>{item.JobNo}</td>
                                                    <td>{item.PartNo}</td>
                                                    <td>{item.Material}</td>
                                                    <td>{EstimatedSQFTJob}</td>
                                                    <td>{item.ActualSQFTJob}</td>
                                                    <td style={{ color: difference >= 0 ? 'green' : 'red', fontWeight: 'bold', }}>{difference}</td>
                                                    <td>{percentageDiff}%</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>

                                <Table striped bordered hover style={{ marginTop: '20px' }}>
                                    <thead>
                                        <tr>
                                            <th>Total Est Sq Ft</th>
                                            <th>Total Act Sq Ft</th>
                                            <th>Total + / -</th>
                                            <th>Total %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{totalEstSqFt}</td>
                                            <td>{totalActSqFt}</td>
                                            <td style={{ color: totalDifference >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                                                {totalDifference}
                                            </td>
                                            <td>{totalPercentageDiff}%</td>
                                        </tr>
                                    </tbody>
                                </Table>

                                <Button className='vtiger' onClick={resetForm} style={{ marginTop: '20px' }}>
                                    Reset
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}