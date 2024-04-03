import api from '../../api/api';

const updateItem = async (itemName, itemLocation, currentScaleId, itemAlert) => {
    const res = await api.post('/scales/updateItem', {
        itemName,
        itemLocation,
        currentScaleId,
        itemAlert,
    });
    return res.data;
}

export default updateItem;