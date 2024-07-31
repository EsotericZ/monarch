import api from '../../api/api';

const updateJob = async (id, blNotes, osvNotes, ariba) => {
    const res = await api.post('/backlog/updateJob', {
        id,
        blNotes, 
        osvNotes, 
        ariba,
    });
    return res.data;
}

export default updateJob;