import apiRFID from '../apiRFID';

const getAllRFID = async () => {
    const res = await apiRFID.get('/users/getAllUsers');
    return res.data;
}

export default getAllRFID;