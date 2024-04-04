import api from '../../api/api';

const updateItem = async (itemName, itemLocation, currentItemId, itemAlert, itemRack, itemShelf, itemBin, itemArea) => {
    const res = await api.post('/scales/updateItem', {
        itemName,
        itemLocation,
        currentItemId,
        itemAlert,
        itemRack,
        itemShelf,
        itemBin,
        itemArea
    });
    return res.data;
}

export default updateItem;