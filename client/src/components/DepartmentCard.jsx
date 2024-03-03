import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';

import flaserIcon from '../images/flaserIcon.png';
import formingIcon from '../images/formingIcon.png';
import laserIcon from '../images/laserIcon.png';
import punchIcon from '../images/punchIcon.png';
import sawIcon from '../images/sawIcon.png';
import shearIcon from '../images/shearIcon.png';
import slaserIcon from '../images/slaserIcon.png';
import tlaserIcon from '../images/tlaserIcon.png';

export const DepartmentCard = ({ area }) => {
    let backgroundColor;
    switch (area.areaType) {
        case 'production':
            backgroundColor = 'lightgreen';
            break;
        case 'programming':
            backgroundColor = 'red';
            break;
        case 'tools':
            backgroundColor = 'yellow';
            break;
        default:
            backgroundColor = 'white'; // Default background color
            break;
    }

    return (
        <Link to={area.link}>
            <Card style={{ width: '250px', margin: '10px', padding: '10px', backgroundColor }}>
                {area.image == 'flaser' ? (
                    <Card.Img variant="top" src={flaserIcon} />
                ) : area.image == 'forming' ? (
                    <Card.Img variant="top" src={formingIcon} />
                ) : area.image == 'laser' ? (
                    <Card.Img variant="top" src={laserIcon} />
                ) : area.image == 'punch' ? (
                    <Card.Img variant="top" src={punchIcon} />
                ) : area.image == 'saw' ? (
                    <Card.Img variant="top" src={sawIcon} />
                ) : area.image == 'shear' ? (
                    <Card.Img variant="top" src={shearIcon} />
                ) : area.image == 'slaser' ? (
                    <Card.Img variant="top" src={slaserIcon} />
                ) : area.image == 'tlaser' ? (
                    <Card.Img variant="top" src={tlaserIcon} />
                ) : null
                }
                <Card.Body>
                    <Card.Title className="text-center">{area.area}</Card.Title>
                    <Card.Text>
                        <div>Needs Nesting: {area.nest}</div>
                        <div>Total Jobs: {area.jobs}</div>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Link>
    )
}