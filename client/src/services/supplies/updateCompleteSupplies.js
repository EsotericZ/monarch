import api from '../../api/api';

const updateCompleteSupplies = async (id) => {
    const res = await api.post('/supplies/updateCompleteSupplies', {
        id: id
    });
    return res.data;
}

export default updateCompleteSupplies;