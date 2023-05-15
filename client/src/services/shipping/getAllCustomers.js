import api from '../api';

const getAllCustomers = async () => {
    const res = await api.get('/shipping/getAllCustomers');
    return res.data
};

export default getAllCustomers;