import { observable, action } from "mobx";

const ob = observable({
    ccinputEditingMode: { 
        number: false,
        name: false,
        expiry: false,
        security: false
    }, 
    creditCardType: '',
    methods: {
        credit: {
            name: 'Credit card',
            imageIcon: '',
            id: 0,
            icons: {
                visa: 'visa',
                mastercard: 'mastercard',
                amex: 'amex',
                discover: 'discover'
            },
            fields: {
                number: {
                    name: 'Card number',
                },
                name: {
                    name: 'Name on card',
                },
                extra: {
                    expiry: {
                        name: 'Expiration date (MM / YY)',
                    },
                    security: {
                        name: 'Security code',
                    }
                }
            }
        },
        paypal: {
            name: 'Paypal',
            imageIcon: 'paypal',
            id: 1,
            fields: {}
        },
        amazon: {
            name: 'Amazon',
            imageIcon: 'amazon',
            id: 2,
            fields: {}
        },
        affirm: {
            name: 'Affirm',
            imageIcon: 'affirm',
            id: 2,
            fields: {}
        }
    },
    selectedRow: 'credit',
    selectedAddress: 'same',
    sameAddressRadio: 'same',
    differentAddressRadio: 'different',
    ccsaveData: { 
        number: '',
        name: '',
        expiry: '',
        security: ''
    },
    proceedToResults: false,
    saveData: {
        email: '',
        checkSubscribe: false,
        firstname: '',
        lastname: '',
        company: '',
        address: '',
        apartment: '',
        city: '',
        country: 'US',
        state: 'Alabama',
        zipcode: '',
        phone: '',
        countryName: '',
        finalAddress: ''
    },
    inputEditingMode: { 
        email: false,
        firstname: false,
        lastname: false,
        company: false,
        address: false,
        apartment: false,
        city: false,
        zipcode: false,
        phone: false
    },
    contactRequired: false
});

const setCCInputToEditing = action((inputName, flag) => {
    if(inputName in ob.ccinputEditingMode) {
        ob.ccinputEditingMode[inputName] = flag;
    }
});

const setInputToEditing = action((inputName, flag) => {
    if(inputName in ob.inputEditingMode) {
        ob.inputEditingMode[inputName] = flag;
    }
});

const setProceedToResults = action(() => {
    ob.proceedToResults = !ob.proceedToResults;
});

const cc_format = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || ''
    const parts = []

    for (let i=0, len=match.length; i<len; i+=4) {
        parts.push(match.substring(i, i+4))
    }

    if (parts.length) {
        return parts.join(' ')
    } else {
        return value
    }
};

const resetFields = action(() => {
    ob.ccsaveData.number = '';
    ob.ccsaveData.name = '';
    ob.ccsaveData.expiry = '';
    ob.ccsaveData.security = '';

    ob.ccinputEditingMode.number = false;
    ob.ccinputEditingMode.name = false;
    ob.ccinputEditingMode.expiry = false;
    ob.ccinputEditingMode.security = false;

    ob.selectedRow = 'credit';
    ob.selectedAddress = 'same';
    ob.sameAddressRadio = 'same';
    ob.differentAddressRadio = 'different';
    ob.creditCardType = '';

    ob.saveData.email = '';
    ob.saveData.checkSubscribe = false;
    ob.saveData.firstname = '';
    ob.saveData.lastname = '';
    ob.saveData.company = '';
    ob.saveData.address = '';
    ob.saveData.apartment = '';
    ob.saveData.city = '';
    ob.saveData.country = 'US';
    ob.saveData.state = 'Alabama';
    ob.saveData.zipcode = '';
    ob.saveData.phone = '';
    ob.saveData.countryName = '';
    ob.saveData.finalAddress = '';

    ob.inputEditingMode.email = false;
    ob.inputEditingMode.firstname = false;
    ob.inputEditingMode.lastname = false;
    ob.inputEditingMode.company = false;
    ob.inputEditingMode.address = false;
    ob.inputEditingMode.apartment = false;
    ob.inputEditingMode.city = false;
    ob.inputEditingMode.zipcode = false;
    ob.inputEditingMode.phone = false;
});

const PaymentStore = {
    setInputToEditing,
    setCCInputToEditing,
    cc_format,
    setProceedToResults,
    resetFields,
    ob
}

export default PaymentStore;