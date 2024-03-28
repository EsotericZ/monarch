import api from '../../api/api';

const updateRecord = async (id, radius, bd, punch, die, dieOpening, notes) => {
    const res = await api.post('/bd/updateRecord', {
        id, 
        radius, 
        bd, 
        punch, 
        die, 
        dieOpening,
        notes
    });
    return res.data;
}

export default updateRecord;