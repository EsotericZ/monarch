import api from '../../api/api';

const deleteSchedule = async (id) => {
    console.log(id)
    const res = await api.post('/shipping/deleteSchedule', {
        id: id
    })
    return res.data;
}

export default deleteSchedule;