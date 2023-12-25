import api from '../../api/api';

const getAllVendors = async () => {
    const res = await api.get('/shipping/getAllVendors');
    return res.data
};

export default getAllVendors;