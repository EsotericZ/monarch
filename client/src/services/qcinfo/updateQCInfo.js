import api from '../../api/api';

const updateQCInfo = async (id, custCode, notes) => {
    const res = await api.post('/qcinfo/updateQCInfo', {
        id,
        custCode, 
        notes, 
    });
    return res.data;
}

export default updateQCInfo;