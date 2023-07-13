import api from '../api';

const getAllVendors = async () => {
    const res = await api.get('/shipping/getAllVendors');
    return res.data
};

export default getAllVendors;