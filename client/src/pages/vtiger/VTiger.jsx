import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';

import { Sidebar } from '../sidebar/Sidebar';
import getAllCustomers from '../../services/vtiger/getAllCustomers';
import getOneCustomer from '../../services/vtiger/getOneCustomer';
import './test.css';

const headers = [
    { label: "Customer Code", key: "CustCode" },
    { label: "Organization Name", key: "CustName" },
    { label: "Customer Status", key: "Active" },
    { label: "Assigned To", key: "SalesID" },
    { label: "Date Open", key: "DateOpen" },
    { label: "Website", key: "Website" },
    { label: "Billing Address", key: "BAddr1" },
    { label: "Billing City", key: "BCity" },
    { label: "Billing State", key: "BState" },
    { label: "Billing Postal Code", key: "BZIPCode" },
    { label: "Primary Phone", key: "Phone" },
    { label: "Customer End Use", key: "WorkCode" },
    { label: "Date Last Activity", key: "DateLast" },
    { label: "YTD Sales", key: "YTDSales" },
];

export const VTiger = () => {
    const [details, setDetails] = useState('');
    const [custCode, setCustCode] = useState('');

    const fetchAllExportCSV = async () => {
        try {
            const res = await getAllCustomers();

            const csvData = res.map(item => {
                const dateOpen = item.DateOpen ? item.DateOpen.split('T')[0] : '';
                const dateLast = item.DateLast ? item.DateLast.split('T')[0] : '';
                const active = item.Active == 'N' ? 'Inactive' : 'Active';

                return {
                    CustCode: item.CustCode,
                    CustName: item.CustName,
                    Active: active,
                    SalesID: item.SalesID,
                    DateOpen: dateOpen,
                    Website: item.Website,
                    BAddr1: item.BAddr1, 
                    BCity: item.BCity, 
                    BState: item.BState, 
                    BZIPCode: item.BZIPCode, 
                    Phone: item.Phone, 
                    WorkCode: item.WorkCode,
                    DateLast: dateLast,
                    YTDSales: item.YTDSales,
                }
            });

            const csvContent = [
                headers.map(header => header.label).join(','),
                ...csvData.map(item => Object.values(item).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'AllCustomers.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOneExportCSV = async () => {
        try {
            const res = await getOneCustomer(custCode);

            const csvData = res.map(item => {
                const dateOpen = item.DateOpen ? item.DateOpen.split('T')[0] : '';
                const dateLast = item.DateLast ? item.DateLast.split('T')[0] : '';
                const active = item.Active == 'N' ? 'Inactive' : 'Active';

                return {
                    CustCode: item.CustCode,
                    CustName: item.CustName,
                    Active: active,
                    SalesID: item.SalesID,
                    DateOpen: dateOpen,
                    Website: item.Website,
                    BAddr1: item.BAddr1, 
                    BCity: item.BCity, 
                    BState: item.BState, 
                    BZIPCode: item.BZIPCode, 
                    Phone: item.Phone, 
                    WorkCode: item.WorkCode,
                    DateLast: dateLast,
                    YTDSales: item.YTDSales,
                }
            });

            const csvContent = [
                headers.map(header => header.label).join(','),
                ...csvData.map(item => Object.values(item).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${custCode}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
        }
    };
      
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
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                            <Button className='vtiger' onClick={() => fetchOneExportCSV()}>
                                Get Customer
                            </Button>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '75px' }}></div>
                    <div className='mx-3'>
                        <div style={{ width: 'fit-content', marginTop: '100px' }}>
                            <Button className='vtiger' onClick={() => fetchAllExportCSV()}>
                                Get All Customers
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}