import { observable, values, autorun, action } from "mobx";
import ProductListStore from './ProductListStore';
import ContactInformationStore from './ContactInformationStore';
const data= require('countrycitystatejson');

const ob = observable({
    countries: {
        US: { 
            shortName: 'US',
            name: 'United States',
            states: []
        },
        CA: { 
            shortName: 'CA',
            name: 'Canada',
            states: []
        },
    },
    activeStates: [],
    verifiedZipCode: false,
    onStateSelectChange: false
});

const handleStateList = action((country) => {
    ob.activeStates = [];
    if(country) {
        let states = ob.countries[country]['states'];
        states.forEach((state, key) => {
            ob.activeStates.push(String(Object.keys(state)));
        });
        ContactInformationStore.ob.saveData.state = ob.activeStates[0];
    }
});

autorun(() => {
    Object.keys(ob.countries).map((country, key) => {
        let currentShortName = ob.countries[country].shortName;

        if('states' in data.getCountryByShort(currentShortName)) {
            let states = data.getCountryByShort(currentShortName)['states'];
            let aState;
            Object.keys(states).map((stateName, key2) => {
                let statesId = [];
                let taxRate = 0;
                states[stateName].forEach(cityInfo=> {
                    Object.keys(cityInfo).map((cityKey, key3) => {
                        // if zip code already added into statesId, then don't need add duplicate
                        if(cityKey === 'state_id') {
                            if(!statesId.includes(cityInfo[cityKey])) {
                                if(cityInfo[cityKey].length > 0) {
                                    statesId.push(cityInfo[cityKey]);
                                    // random tax value set for country
                                    if(country === 'US') {
                                        taxRate = 5;
                                    }
                                    else {
                                        taxRate = 10;
                                    }
                                }
                            }
                        }
                    })
                    
                });
                aState = { 
                    [stateName]: {
                        zip: statesId,
                        taxRate
                    }
                };
                ob.countries[country].states.push(aState);
            });   
        }
    });

    // get initial stateslist 
    handleStateList(ContactInformationStore.ob.saveData.country)
});

const verifyZipCode = action((cZip, cState, cCountry) => {
    let states = ob.countries[cCountry]['states'];
    let status = false;

    states.forEach((stateObj, key) => {
        if(String(Object.keys(stateObj)) === cState) { 
            Object.keys(stateObj).map((citykey, key3) => {
                Object.keys(stateObj[citykey]).map((zipAndTaxKey) => {
                    if(zipAndTaxKey === 'zip') {
                        console.log("Expected string: " + String(stateObj[citykey][zipAndTaxKey]));
                        if(cZip === String(stateObj[citykey][zipAndTaxKey])) {
                            status = true;
                            handleStateChange(cState, cCountry);
                        }
                    }
                });
            });
        }
    });

    ob.verifiedZipCode = status;
    return status;
});

const handleStateChange = action((cState, cCountry) => {
    let states = ob.countries[cCountry]['states'];

    states.forEach((stateObj, key) => {
        if(String(Object.keys(stateObj)) === cState) { 
            Object.keys(stateObj).map((stateKey, key3) => {
                if(cState === stateKey) {
                    Object.keys(stateObj[stateKey]).map((zipAndTaxKey) => {
                        if(zipAndTaxKey === 'taxRate') {
                            let taxRate = stateObj[stateKey][zipAndTaxKey]/100;
                            ProductListStore.ob.totalPrice.taxes = taxRate * ProductListStore.ob.totalPrice.subtotal;
                            console.log('taxRate:', stateObj[stateKey][zipAndTaxKey]);
                            console.log('taxes:', ProductListStore.ob.totalPrice.taxes);
                        }
                    });
                }
            });
        }
    });
});

const handleStateSelectChange = action((val) => {
    ob.onStateSelectChange = val;
});

var CountriesStatesStore = { 
    handleStateList,
    verifyZipCode,
    handleStateChange,
    handleStateSelectChange,
    ob
};

export default CountriesStatesStore;