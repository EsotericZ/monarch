import { Sidebar } from '../sidebar/Sidebar';

export const Test = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginLeft: '80px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    Test
                </div>
            </div>
        </div>
    )
}



// import { useState } from 'react';
// import { Button } from 'react-bootstrap';
// import { CSVLink } from 'react-csv';

// import { Sidebar } from '../sidebar/Sidebar';
// import getAllCustomers from '../../services/vtiger/getAllCustomers';
// import getOneCustomer from '../../services/vtiger/getOneCustomer';
// import './test.css';

// const headers = [
//     { label: "Code", key: "CustCode" },
//     { label: "Name", key: "CustName" },
//     { label: "Active", key: "Active" },
//     { label: "Salesman", key: "SalesID" },
//     { label: "Website", key: "Website" },
//     // { label: "Address", key: "BAddr1" },
//     { label: "City", key: "BCity" },
//     { label: "State", key: "BState" },
//     { label: "ZIP", key: "BZIPCode" },
//     { label: "Phone", key: "Phone" },
//     { label: "Work", key: "WorkCode" },
// ];

// export const Test = () => {
//     const [details, setDetails] = useState('');
//     const [custCode, setCustCode] = useState('');
//     const [custData, setCustData] = useState([]);

//     const fetchAllExportCSV = async () => {
//         try {
//             const res = await getAllCustomers();
//             setCustData(res);

//             const csvData = res.map(item => ({
//                 Code: item.CustCode,
//                 Name: item.CustName,
//                 Active: item.Active,
//                 Salesman: item.SalesID,
//                 Website: item.Website,
//                 // Address: item.BAddr1, 
//                 City: item.BCity, 
//                 State: item.BState, 
//                 ZIP: item.BZIPCode, 
//                 Phone: item.Phone, 
//                 Work: item.WorkCode
//             }));

//             const csvContent = [
//                 headers.map(header => header.label).join(','),
//                 ...csvData.map(item => Object.values(item).join(','))
//             ].join('\n');

//             const blob = new Blob([csvContent], { type: 'text/csv' });
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', 'AllCustomers.csv');
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const fetchOneExportCSV = async () => {
//         try {
//             const res = await getOneCustomer(custCode);
//             setCustData(res);

//             const csvData = res.map(item => ({
//                 Code: item.CustCode,
//                 Name: item.CustName,
//                 Active: item.Active,
//                 Salesman: item.SalesID,
//                 Website: item.Website,
//                 // Address: item.BAddr1, 
//                 City: item.BCity, 
//                 State: item.BState, 
//                 ZIP: item.BZIPCode, 
//                 Phone: item.Phone, 
//                 Work: item.WorkCode
//             }));

//             const csvContent = [
//                 headers.map(header => header.label).join(','),
//                 ...csvData.map(item => Object.values(item).join(','))
//             ].join('\n');

//             const blob = new Blob([csvContent], { type: 'text/csv' });
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `${custCode}.csv`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (err) {
//             console.error(err);
//         }
//     };
      
//     return (
//         <div style={{ display: 'flex' }}>
//             <Sidebar />
//             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginLeft: '80px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'center' }}>
//                     <div className='mx-3'>
//                         <div style={{ width: 'fit-content', marginTop: '100px' }}>
//                             <div className="form-group mt-3">
//                                 <input 
//                                     className='input form-control mt-1' 
//                                     type='text' 
//                                     placeholder='Customer Code' 
//                                     onChange={(e) => {setCustCode(e.target.value)}}
//                                 />
//                             </div>
//                             <Button className='vtiger' onClick={() => fetchOneExportCSV()}>
//                                 Get Customer
//                             </Button>
//                         </div>
//                     </div>
//                     <div style={{ width: '20px' }}></div>
//                     <div className='mx-3'>
//                         <div style={{ width: 'fit-content', marginTop: '100px' }}>
//                             <Button className='vtiger' onClick={() => fetchAllExportCSV()}>
//                                 Get All Customers
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }