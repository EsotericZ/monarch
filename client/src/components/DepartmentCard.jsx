import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';

import bdIcon from '../images/bdIcon.png';
import engineeringIcon from '../images/engineeringIcon.png';
import flaserIcon from '../images/flaserIcon.png';
import formingIcon from '../images/formingIcon.png';
import hardwareIcon from '../images/hardwareIcon.png';
import laserIcon from '../images/laserIcon.png';
import machineIcon from '../images/machineIcon.png';
import punchIcon from '../images/punchIcon.png';
import qualityIcon from '../images/qualityIcon.png';
import qcInfoIcon from '../images/qcInfoIcon.png';
import sawIcon from '../images/sawIcon.png';
import shearIcon from '../images/shearIcon.png';
import slaserIcon from '../images/slaserIcon.png';
import tapIcon from '../images/tapIcon.png';
import tlaserIcon from '../images/tlaserIcon.png';

export const DepartmentCard = ({ area }) => {
    let backgroundColor;
    switch (area.areaType) {
        case 'production':
            backgroundColor = 'lightgreen';
            break;
        case 'programming':
            backgroundColor = '#F75D59';
            break;
        case 'tooling':
            backgroundColor = '#CDE3FD';
            break;
        case 'misc':
            backgroundColor = 'yellow';
            break;
        default:
            backgroundColor = 'white';
            break;
    }

    return (
        <Link to={area.link}>
            <Card style={{ width: '250px', margin: '10px', padding: '10px', backgroundColor }}>
                {area.image == 'bd' ? (
                    <Card.Img variant="top" src={bdIcon} />
                ) : area.image == 'engineering' ? (
                    <Card.Img variant="top" src={engineeringIcon} />
                ) : area.image == 'flaser' ? (
                    <Card.Img variant="top" src={flaserIcon} />
                ) : area.image == 'forming' ? (
                    <Card.Img variant="top" src={formingIcon} />
                ) : area.image == 'hardware' ? (
                    <Card.Img variant="top" src={hardwareIcon} />
                ) : area.image == 'laser' ? (
                    <Card.Img variant="top" src={laserIcon} />
                ) : area.image == 'machining' ? (
                    <Card.Img variant="top" src={machineIcon} />
                ) : area.image == 'punch' ? (
                    <Card.Img variant="top" src={punchIcon} />
                ) : area.image == 'quality' ? (
                    <Card.Img variant="top" src={qualityIcon} />
                ) : area.image == 'qcInfo' ? (
                    <Card.Img variant="top" src={qcInfoIcon} />
                ) : area.image == 'saw' ? (
                    <Card.Img variant="top" src={sawIcon} />
                ) : area.image == 'shear' ? (
                    <Card.Img variant="top" src={shearIcon} />
                ) : area.image == 'slaser' ? (
                    <Card.Img variant="top" src={slaserIcon} />
                ) : area.image == 'tap' ? (
                    <Card.Img variant="top" src={tapIcon} />
                ) : area.image == 'tlaser' ? (
                    <Card.Img variant="top" src={tlaserIcon} />
                ) : null
                }
                <Card.Body>
                    <Card.Title className="text-center">{area.area}</Card.Title>
                </Card.Body>
            </Card>
        </Link>
    )
}