import api from '../../api/api';

const createQCNote = async (custCode, notes) => {
    const res = await api.post('/qcinfo/createQCNote', {
        custCode, 
        notes, 
    });
    return res.data;
}

export default createQCNote;