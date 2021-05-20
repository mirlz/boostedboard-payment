import { observable } from "mobx";

const ob = observable({
    breadcrumbs: {
        information: {
            name: 'Information',
            id: 0,
        },
        shipping: {
            name: 'Shipping Method',
            id: 1
        },
        payment: {
            name: 'Payment Method',
            id: 2
        }
    }
});

const convertStringToPrice = (n) => {
    let newnum = parseFloat(n).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
    return newnum;
}

var CommonStore = {
    ob,
    convertStringToPrice
};

export default CommonStore;