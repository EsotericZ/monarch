import api from '../../api/api';

const createMMItem = async (radioScaleId, itemName, itemLocation, itemAlert) => {
    const res = await api.post('/scales/createMMItem', {
        scaleId: radioScaleId,
        itemName: itemName,
        itemLocation: itemLocation,
        alert: itemAlert,
    });
    return res.data;
}

export default createMMItem;