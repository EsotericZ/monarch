import api from '../../api/api';

const updateTimes = async (updateID, newStart, newEnd) => {
    console.log(updateID, newStart, newEnd)
    const res = await api.post('/shipping/updateTimes', {
        id: updateID,
        start: newStart,
        end: newEnd,
    });
    return res.data;
}

export default updateTimes;