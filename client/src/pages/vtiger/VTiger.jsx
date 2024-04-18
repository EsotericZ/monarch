import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';

import { Sidebar } from '../sidebar/Sidebar';
import getAllCustomers from '../../services/vtiger/getAllCustomers';
import getOneCustomer from '../../services/vtiger/getOneCustomer';
import getAllContacts from '../../services/vtiger/getAllContacts';
import getOneContact from '../../services/vtiger/getOneContact';
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

const headersContact = [
    { label: "Active", key: "Active" },
    { label: "First Name", key: "Contact" },
    { label: "Last Name", key: "Contact" },
    { label: "Title", key: "Title" },
    { label: "Office Phone", key: "Phone" },
    { label: "Phone Ext", key: "Extension" },
    { label: "Primary Email", key: "EMail" },
    { label: "Mobile Phone", key: "Cell_Phone" },
    { label: "Fax", key: "FAX" },
    { label: "Secondary Email", key: "EMail" },
    { label: "Comments", key: "Comments" },
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

    const fetchAllContactCSV = async () => {
        try {
            const res = await getAllContacts();
            console.log(res)

            const csvData = res.map(item => {
                const firstName = item.Contact ? item.Contact.split(' ')[0] : '';
                const lastName = item.Contact ? item.Contact.split(' ')[1] : '';

                return {
                    Active: item.Active,
                    firstName: firstName,
                    lastName: lastName,
                    Title: item.Title,
                    Phone: item.Phone,
                    Extension: item.Extension,
                    EMail: item.EMail, 
                    Cell_Phone: item.Cell_Phone,
                    FAX: item.FAX, 
                    EMail: item.EMail, 
                    Comments: item.Comments, 
                }
            });

            const csvContent = [
                headersContact.map(header => header.label).join(','),
                ...csvData.map(item => Object.values(item).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'AllCustomersContacts.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOneContactCSV = async () => {
        try {
            const res = await getOneContact(custCode);
            console.log(res)

            const csvData = res.map(item => {
                const firstName = item.Contact ? item.Contact.split(' ')[0] : '';
                const lastName = item.Contact ? item.Contact.split(' ')[1] : '';

                return {
                    Active: item.Active,
                    firstName: firstName,
                    lastName: lastName,
                    Title: item.Title,
                    Phone: item.Phone,
                    Extension: item.Extension,
                    EMail: item.EMail, 
                    Cell_Phone: item.Cell_Phone,
                    FAX: item.FAX, 
                    EMail: item.EMail, 
                    Comments: item.Comments, 
                }
            });

            const csvContent = [
                headersContact.map(header => header.label).join(','),
                ...csvData.map(item => Object.values(item).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${custCode} CONTACT.csv`);
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
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <div className='mx-3' style={{ textAlign: 'center', marginTop: '50px' }}>
                        <h1>Company Info</h1>
                        <div style={{ width: 'fit-content', marginTop: '20px' }}>
                            <div className="form-group mt-3" style={{ display: 'flex', alignItems: 'center' }}>
                                <input 
                                    className='input form-control mt-1' 
                                    type='text' 
                                    placeholder='Customer Code' 
                                    onChange={(e) => {setCustCode(e.target.value)}}
                                    style={{ marginRight: '10px' }}
                                />
                                <Button className='vtiger' onClick={() => fetchOneExportCSV()}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '75px' }}></div>
                    <div className='mx-3'>
                        <div style={{ width: 'fit-content', marginTop: '20px' }}>
                            <Button className='vtiger' onClick={() => fetchAllExportCSV()}>
                                Get All Customers
                            </Button>
                        </div>
                    </div>
                    <div className='mx-3' style={{ textAlign: 'center', marginTop: '100px' }}>
                        <h1>Contact Info</h1>
                        <div style={{ width: 'fit-content', marginTop: '20px' }}>
                            <div className="form-group mt-3" style={{ display: 'flex', alignItems: 'center' }}>
                                <input 
                                    className='input form-control mt-1' 
                                    type='text' 
                                    placeholder='Customer Code' 
                                    onChange={(e) => {setCustCode(e.target.value)}}
                                    style={{ marginRight: '10px' }}
                                />
                                <Button className='vtiger' onClick={() => fetchOneContactCSV()}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '75px' }}></div>
                    <div className='mx-3'>
                        <div style={{ width: 'fit-content', marginTop: '20px' }}>
                            <Button className='vtiger' onClick={() => fetchAllContactCSV()}>
                                Get All Customers
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}