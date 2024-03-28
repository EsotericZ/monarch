import api from '../../api/api';

const getRecords = async () => {
    const res = await api.get('/bd/getRecords');
    return res.data
};

export default getRecords;