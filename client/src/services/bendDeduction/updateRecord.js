import api from '../../api/api';

const updateRecord = async (id, radius, bd, punch, die, notes) => {
    const res = await api.post('/bd/updateRecord', {
        id, 
        radius, 
        bd, 
        punch, 
        die, 
        notes
    });
    return res.data;
}

export default updateRecord;