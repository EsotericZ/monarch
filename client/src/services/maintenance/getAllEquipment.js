import api from '../api';

const getAllEquipment = async () => {
    const res = await api.get('/maintenance/getAllEquipment');
    return res.data
};

export default getAllEquipment;