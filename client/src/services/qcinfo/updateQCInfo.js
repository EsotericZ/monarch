import api from '../../api/api';

const updateQCInfo = async (id, custCode, coc, matlCert, platCert, notes) => {
    const res = await api.post('/qcinfo/updateQCInfo', {
        id,
        custCode, 
        coc,
        matlCert,
        platCert,
        notes, 
    });
    return res.data;
}

export default updateQCInfo;