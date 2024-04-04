import api from '../../api/api';

const createMMItem = async (radioScaleId, newItemId, itemName, itemLocation, itemAlert) => {
    const res = await api.post('/scales/createMMItem', {
        scaleId: radioScaleId,
        itemId: newItemId,
        itemName: itemName,
        itemLocation: itemLocation,
        alert: itemAlert,
    });
    return res.data;
}

export default createMMItem;