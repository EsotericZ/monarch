import { useState } from 'react';
import { Button } from 'react-bootstrap';

import { Sidebar } from '../sidebar/Sidebar';
import getAllCustomers from '../../services/vtiger/getAllCustomers';
import './test.css';

export const Test = () => {
    const [details, setDetails] = useState('');

    const fetchData = async () => {
        try {
            const res = await getAllCustomers();
            console.log(res)
            setDetails(res[0])
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginLeft: '80px' }}>
                <div style={{ width: 'fit-content', marginTop: '100px' }}>
                    <Button className='vtiger' onClick={() => fetchData()}>
                        Get Customers
                    </Button>
                </div>
                <br/>
                <h3>Code: {details.CustCode}</h3>
                <h3>Active: {details.Active}</h3>
                <h3>Name: {details.CustName}</h3>
                <h3>Assigned: {details.SalesID}</h3>
                <h3>Website: {details.Website}</h3>
            </div>
        </div>
    )
}