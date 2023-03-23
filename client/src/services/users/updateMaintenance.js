import api from "../api";

const updateMaintenance = async (id) => {
    const res = await api.post('/users/updateMaintenance', {
        id: id
    });
    return res.data;
}

export default updateMaintenance;