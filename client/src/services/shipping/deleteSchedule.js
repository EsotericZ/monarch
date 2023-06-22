import api from '../api';

const deleteSchedule = async (id) => {
    console.log(id)
    const res = await api.post('/shipping/deleteSchedule', {
        id: id
    })
    return res.data;
}

export default deleteSchedule;