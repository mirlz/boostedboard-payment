import { observable, action, autorun } from "mobx";

const ob = observable({
    data: { 
        product1: {
            img: 'rathian',
            title: {
                name: 'Chibi Rathian',
                eta: 'WIll fly to you in 1-2 business days',
            },
            eta: 'WIll fly to you in 1-2 business days',
            price: '1099',
            qty: 1
        },
        product2: {
            img: 'rathalos',
            title: {
                name: 'Chibi Rathalos',
                eta: 'WIll fly to you in 1-2 business days',
            },
            price: '999',
            qty: 1
        },
    },
    inputEditingMode: {
        giftcode: false
    },
    giftCodeSave: '',
    giftCodeSaveTemp: '',
    showGiftCode: false, 
    totalPrice: {
        subtotal: 0,
        shipping: 0,
        taxes: 0,
    },
});

const showGiftCodeBar = action((flag) => {
    ob.showGiftCode = flag;
});

const setInputToEditing = action((inputName, flag) => {
    if(inputName in ob.inputEditingMode) {
        ob.inputEditingMode[inputName] = flag;
    }

});

const setShipping = action((value) => {
    ob.totalPrice.shipping = value;
});

const checkIfGiftCodeBarShouldShow = action(() => {
    ob.giftCodeSaveTemp = '';

    if(ob.giftCodeSave.length > 0) {
        showGiftCodeBar(true);
        ob.inputEditingMode.giftcode = true;
    } else {
        showGiftCodeBar(false);
        ob.inputEditingMode.giftcode = false;
    }
})

autorun(() => {
    Object.keys(ob.data).map((productno, key2) => {
        Object.keys(ob.data[productno]).map((productKey, key2) => {
            if(productKey === 'price') {
                ob.totalPrice.subtotal += Number(ob.data[productno][productKey]);
            }
        });
    })
});

const resetFields = action(() => {
    ob.totalPrice.taxes = 0;
    ob.inputEditingMode.giftCodeSave = '';
    showGiftCodeBar(false);
});

var ProductListStore = { 
    showGiftCodeBar,
    setInputToEditing,
    setShipping,
    resetFields,
    checkIfGiftCodeBarShouldShow,
    ob
}

export default ProductListStore;