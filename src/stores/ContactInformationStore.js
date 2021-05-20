import { observable, action } from "mobx";

const ob = observable({
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
        state: '',
        zipcode: '',
        phone: '',
        countryName: '',
        finalAddress: ''
    },
    proceedToShipping: false
});

const setInputToEditing = action((inputName, flag) => {
    if(inputName in ob.inputEditingMode) {
        ob.inputEditingMode[inputName] = flag;
    }
});

const setProceedToShipping = action(() => {
    ob.proceedToShipping = !ob.proceedToShipping;
});

const setCheckSubscribe = action((flag) => {
    ob.saveData.checkSubscribe = flag;
});

const resetFields = action(() => {
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
})

var ContactInformationStore = { 
    ob,
    setInputToEditing,
    setProceedToShipping,
    setCheckSubscribe,
    resetFields,
};

export default ContactInformationStore;