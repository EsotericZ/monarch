import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

import { FaUser } from "react-icons/fa";
import { FaUserCog } from 'react-icons/fa';

export const EmployeeCard = ({ user, handleOpenUpdate }) => {
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
        <Card 
            style={{ width: '400px', margin: '10px', padding: '10px', backgroundColor }}
            onClick={() => handleOpenUpdate(user)}
        >
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
                    {user.etch != '-' ?
                        <td className='text-center'><a href='http://10.0.1.45:3000/' target='__blank'>RFID: {user.etch}</a></td>
                    :
                        <td className='text-center'><a href='http://10.0.1.45:3000/' target='__blank'>No RFID Assigned</a></td>
                    }
                </div>
                <div className="mt-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {user.engineering &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>Engineering</Badge>
                    }
                    {user.machining &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>Machining</Badge>
                    }
                    {user.quality &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>Quality</Badge>
                    }
                    {user.laser &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>Laser</Badge>
                    }
                    {user.forming &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>Forming</Badge>
                    }
                    {user.tlaser &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>TLaser</Badge>
                    }
                    {user.saw &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>Saw</Badge>
                    }
                    {user.punch &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>Punch</Badge>
                    }
                    {user.shear &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>Shear</Badge>
                    }
                    {user.maintenance &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>Maintenace</Badge>
                    }
                    {user.shipping &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>Shipping</Badge>
                    }
                    {user.purchasing &&
                        <Badge pill bg='secondary' style={{ fontSize: '13px', width: '100px' }}>Purchasing</Badge>
                    }
                </div>
            </Card.Body>
        </Card>
    );
}