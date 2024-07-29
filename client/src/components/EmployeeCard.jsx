import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

import { FaUser } from "react-icons/fa";
import { FaUserCog } from 'react-icons/fa';

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const EmployeeCard = ({ user }) => {
    let backgroundColor;
    switch (user.role) {
        case 'admin':
            backgroundColor = 'lightgreen';
            break;
        case 'employee':
            backgroundColor = '#CDE3FD';
            break;
        case 'temp':
            backgroundColor = 'F75D59';
            break;
        default:
            backgroundColor = 'white';
            break;
    }

    return (
        <Card style={{ width: '400px', margin: '10px', padding: '10px', backgroundColor }}>
            <Card.Body>
                <div className="d-flex align-items-center">
                    <div className="col-auto">
                        {user.role == 'admin' ? 
                            <FaUserCog size={36} />
                        :
                            <FaUser size={36} />
                        }
                    </div>
                    <div className="col" style={{ marginLeft: '20px' }}>
                        <h3 className="mb-0">{user.name}</h3>
                    </div>
                </div>
                <div className="mt-2">
                    <div>Employee No: {user.number} </div>
                    {user.etch ?
                        <td className='text-center'><a href='http://10.0.1.45:3000/' target='__blank'>RFID: {user.etch}</a></td>
                    :
                        <td className='text-center'><a href='http://10.0.1.45:3000/' target='__blank'>No RFID Assaingned</a></td>
                    }
                </div>
                <div className="mt-2">
                    {user.engineering &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '75px' }}>Engineering</Badge>
                    }
                    {user.machining &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '75px' }}>Machining</Badge>
                    }
                    {user.quality &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '75px' }}>Quality</Badge>
                    }
                    {user.laser &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '75px' }}>Laser</Badge>
                    }
                </div>
            </Card.Body>
        </Card>
    );
}