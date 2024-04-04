import api from '../../api/api';

const updateItem = async (itemName, itemLocation, currentItemId, itemAlert) => {
    const res = await api.post('/scales/updateItem', {
        itemName,
        itemLocation,
        currentItemId,
        itemAlert,
    });
    return res.data;
}

export default updateItem;