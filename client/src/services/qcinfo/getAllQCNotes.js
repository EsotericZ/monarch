import api from '../../api/api';

const getAllQCNotes = async () => {
    console.log('hit')
    const res = await api.get('/qcinfo/getAllQCNotes');
    return res.data
};

export default getAllQCNotes;