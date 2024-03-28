import api from '../../api/api';

const createRecord = async (type, subType, gauge, thickness, radius, bd, punch, die, dieOpening, notes, verified) => {
    const res = await api.post('/bd/createRecord', {
        type, 
        subType,
        gauge, 
        thickness, 
        radius, 
        bd, 
        punch, 
        die, 
        dieOpening,
        notes, 
        verified
    });
    return res.data;
}

export default createRecord;