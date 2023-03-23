import api from "../api";

const updateShipping = async (id) => {
    const res = await api.post('/users/updateShipping', {
        id: id
    });
    return res.data;
}

export default updateShipping;