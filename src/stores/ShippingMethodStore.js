import { observable, action } from "mobx";

const ob = observable({
    method: {
        US: {
            name: 'Ground Shipping',
            cost: 'free'
        },
        CS: {
            name: 'Ground Shipping',
            cost: 'free'
        }
    }
});

const getShippingRateForCountry = action((country) => {
    return ob.method[country].cost;
})

var ShippingMethodStore = {
    getShippingRateForCountry,
    ob
};

export default ShippingMethodStore;