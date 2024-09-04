import api from '../../api/api';

const addNewScaleLog = async (log) => {
    console.log('addNewScaleLog')
    console.log(log)
    const res = await api.post('/scaleLog/addNewScaleLog', {
        log
    });
    return res.data;
}

export default addNewScaleLog;