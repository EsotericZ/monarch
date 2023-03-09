import api from '../api';

const createRequest = async (requestedBy, area, equipment, requestType, description) => {
    const res = await api.post('/maintenance/createRequest', {
        'requestedBy': requestedBy,
        'area': area,
        'equipment': equipment,
        'requestType': requestType,
        'description': description,
    });
    return res.data;
}

export default createRequest;