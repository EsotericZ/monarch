import api from '../api';

const getAllOrders = async () => {
    const res = await api.get('/shipping/getAllOrders');
    return res.data
};

export default getAllOrders;