import { useState } from 'react';
import { Button } from 'react-bootstrap';

import { Sidebar } from '../sidebar/Sidebar';
import getAllCustomers from '../../services/vtiger/getAllCustomers';
import getOneCustomer from '../../services/vtiger/getOneCustomer';
import './test.css';

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

export const Test = () => {
    const [details, setDetails] = useState('');
    const [custCode, setCustCode] = useState('');

    const fetchAll = async () => {
        try {
            const res = await getAllCustomers();
            setDetails(res[0])
            console.log(res[0])

            const csvWriter = createCsvWriter({
                path: 'customers.csv',
                header: [
                    { id: 'Active', title: 'Active' },
                    { id: 'CustCode', title: 'Code' },
                ]
            });

            await csvWriter.writeRecords(res[0]);

            const url = window.URL.createObjectURL(new Blob([res[0]]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'customers.csv'); // Set desired filename
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
        }
    }

    const fetchOne = async () => {
        try {
            const res = await getOneCustomer(custCode);
            setDetails(res[0])
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginLeft: '80px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className='mx-3'>
                        <div style={{ width: 'fit-content', marginTop: '100px' }}>
                            <div className="form-group mt-3">
                                <input 
                                    className='input form-control mt-1' 
                                    type='text' 
                                    placeholder='Customer Code' 
                                    onChange={(e) => {setCustCode(e.target.value)}}
                                />
                            </div>
                            <Button className='vtiger' onClick={() => fetchOne()}>
                                Get Customer
                            </Button>
                        </div>
                    </div>
                    <div style={{ width: '20px' }}></div>
                    <div className='mx-3'>
                        <div style={{ width: 'fit-content', marginTop: '100px' }}>
                        <Button className='vtiger' onClick={() => fetchAll()}>
                            Get All Customers
                        </Button>
                    </div>
                </div>
            </div>
            <br/>
                <h3>Code: {details.CustCode}</h3>
                <h3>Active: {details.Active}</h3>
                {/* <h3>Name: {details.CustName}</h3>
                <h3>Assigned: {details.SalesID}</h3>
                <h3>Website: {details.Website}</h3>
                <h3>Address: {details.BAddr1}</h3>
                <h3>City: {details.BCity}</h3>
                <h3>State: {details.BState}</h3>
                <h3>Zip Code: {details.BZIPCode}</h3>
                <h3>Phone: {details.Phone}</h3>
                <h3>Work Code: {details.WorkCode}</h3> */}
            </div>
        </div>
    )
}