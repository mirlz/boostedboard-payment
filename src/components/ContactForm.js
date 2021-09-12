import React from 'react';   
import { action } from 'mobx';
import {observer} from 'mobx-react-lite';
import CountriesStatesStore from '../stores/CountriesStatesStore';
import { Row, Col, Form, Input, Checkbox, Select, Button } from 'antd';
import { AsYouType } from 'libphonenumber-js';

const FormItem = Form.Item;
const { Option } = Select;

const ContactForm = observer((props) => {
    const form = props.form;
    const fieldData = props.fieldData;
    const { getFieldDecorator, getFieldValue } = form;
    const inputEditArr = props.inputEditArr;
    const countryData = CountriesStatesStore.ob.countries;
    const store = props.store;
    
    const handleInputEditing = action((inputName, inputLength) => {
        if(inputLength > 0) {
            store.setInputToEditing(inputName, true);
        }
        else {
            store.setInputToEditing(inputName, false);
        }
    });

    const handleCountryChange = action((country) => { 
        //load states list
        CountriesStatesStore.handleStateList(country);
        //update default state according to nation, reset zip code
        form.setFields({
            ['contact[state]']: {             
                value: fieldData.state
            }, 
            ['contact[zipcode]']: {             
                value: ''
            }
        });
        inputEditArr.zipcode = false;

        //load tax rate again for default state
        let state = form.getFieldValue('contact[state]');
        CountriesStatesStore.handleStateSelectChange(true);
        CountriesStatesStore.handleStateChange(state, country);
    });

    const handleStateChange = action((value) => { 
        let country = form.getFieldValue('contact[country]');
        CountriesStatesStore.handleStateSelectChange(true);
        CountriesStatesStore.handleStateChange(value, country);
        form.setFields({
            ['contact[zipcode]']: {             
                value: ''
            }
        });
        inputEditArr.zipcode = false;
    });

    const validateZipcode = action((rule, value, callback) => {
        if(value.length <= 0) {
            callback("Enter a zip code")
        }
        else {
            let zipcode = form.getFieldValue('contact[zipcode]');
            let state = form.getFieldValue('contact[state]');
            let country = form.getFieldValue('contact[country]');
            let zipCheck = CountriesStatesStore.verifyZipCode(zipcode, state, country);

            if(!zipCheck) {
                callback("Enter a valid zip code");
            }
        }
        callback();
        return;
    });

    const handlePhoneNumberInput = action((number) => {  
        let newnum = new AsYouType('US').input(number);
        return newnum;    
    });

    return (
        <div>
            <div className="contactSectionForm">
                <Row className="section">
                    <Row className="title">Shipping Address</Row>
                    <Row gutter={12}>
                        <Col xs={24} md={12} lg={12} xl ={12} key="firstname">
                            <FormItem label="First name" className={(inputEditArr.firstname || fieldData.firstname.length > 0) ? 'editing customInput' : 'customInput'}>
                                {getFieldDecorator(`contact`+`[firstname]`, {
                                    initialValue: fieldData.firstname,
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true, 
                                            message: 'Enter a first name',
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder=""
                                        onChange={action(e=> {
                                            fieldData.firstname = e.target.value;
                                            handleInputEditing('firstname', e.target.value.length);
                                        })}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl ={12} key="lastname">
                            <FormItem label="Last name" className={(inputEditArr.lastname || fieldData.lastname.length > 0) ? 'editing customInput' : 'customInput'}>
                                {getFieldDecorator(`contact`+`[lastname]`, {
                                    initialValue: fieldData.lastname,
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true, 
                                            message: 'Enter a last name',
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder=""
                                        onChange={action(e=> {
                                            fieldData.lastname = e.target.value;
                                            handleInputEditing('lastname', e.target.value.length);
                                        })}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col key="company">
                        <FormItem label="Company (optional)" className={(inputEditArr.company || fieldData.company.length > 0) ? 'editing customInput' : 'customInput'}>
                                {getFieldDecorator(`contact`+`[company]`, {
                                    initialValue: fieldData.company,
                                })(
                                    <Input
                                        placeholder=""
                                        onChange={action(e=> {
                                            fieldData.company = e.target.value;
                                            handleInputEditing('company', e.target.value.length);
                                        })}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col key="address">
                        <FormItem label="Address" className={(inputEditArr.address || fieldData.address.length > 0) ? 'editing customInput' : 'customInput'}>
                                {getFieldDecorator(`contact`+`[address]`, {
                                    initialValue: fieldData.address,
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true, 
                                            message: 'Enter an address',
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder=""
                                        onChange={action(e=> {
                                            fieldData.address = e.target.value;
                                            handleInputEditing('address', e.target.value.length);
                                        })}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col key="apartment">
                        <FormItem label="Apartment, suite, etc. (optional)" className={(inputEditArr.apartment || fieldData.apartment.length > 0) ? 'editing customInput' : 'customInput'}>
                                {getFieldDecorator(`contact`+`[apartment]`, {
                                    initialValue: fieldData.apartment,
                                })(
                                    <Input
                                        placeholder=""
                                        onChange={action(e=> {
                                            fieldData.apartment = e.target.value;
                                            handleInputEditing('apartment', e.target.value.length);
                                        })}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col key="city">
                        <FormItem label="City" className={(inputEditArr.city || fieldData.city.length > 0) ? 'editing customInput' : 'customInput'}>
                                {getFieldDecorator(`contact`+`[city]`, {
                                    initialValue: fieldData.city,
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true, 
                                            message: 'Enter a city',
                                        },
                                    ],
                                })(
                                    <Input
                                        placeholder=""
                                        onChange={action(e=> {
                                            fieldData.city = e.target.value;
                                            handleInputEditing('city', e.target.value.length);
                                        })}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col  xs={24} md={8} lg={8} xl ={8} key="country">
                        <FormItem label="Country/Region" className='editing customInput customSelect'>
                                {getFieldDecorator(`contact`+`[country]`, {
                                    initialValue: fieldData.country,
                                })(
                                    <Select
                                        filterOption={false}
                                        onSelect={action(country=> {
                                            handleCountryChange(country);
                                        })}
                                    > 
                                    {Object.keys(countryData).map((country, key)=> {
                                        return <Option value={country} key={country}>{countryData[country].name}</Option>
                                    })}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col  xs={24} md={8} lg={8} xl ={8} key="state">
                        <FormItem label="State" className='editing customInput customSelect'>
                                {getFieldDecorator(`contact`+`[state]`, {
                                    initialValue: fieldData.state,
                                })(
                                    <Select
                                        filterOption={false}
                                        onSelect={action(e=> {
                                            handleStateChange(e);
                                        })}
                                    > 
                                    {CountriesStatesStore.ob.activeStates.map(state => {
                                        return <Option key={state} value={state}>{state}</Option>
                                    })}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col  xs={24} md={8} lg={8} xl ={8} key="zipcode">
                        <FormItem label="ZIP Code" className={(inputEditArr.zipcode || fieldData.zipcode.length > 0) ? 'editing customInput' : 'customInput'}>
                                {getFieldDecorator(`contact`+`[zipcode]`, {
                                    initialValue: fieldData.zipcode,
                                    rules: [{validator: validateZipcode }],
                                })(
                                    <Input
                                        placeholder=""
                                        onChange={action((e)=> {
                                            fieldData.zipcode = e.target.value;
                                            handleInputEditing('zipcode', e.target.value.length);
                                        })}
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Row>
                <Row>
                    <Col key="phone">
                    <FormItem label="Phone" className={(inputEditArr.phone || fieldData.phone.length > 0) ? 'editing customInput' : 'customInput'}>
                            {getFieldDecorator(`contact`+`[phone]`, {
                                initialValue: fieldData.phone,
                                getValueFromEvent: e => handlePhoneNumberInput(e.target.value),
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true, 
                                        message: 'Enter a valid phone number',
                                    },
                                ],
                            })(
                                <Input
                                    placeholder=""
                                    onChange={action(e=> {
                                        fieldData.phone = e.target.value;
                                        handleInputEditing('phone', e.target.value.length);
                                    })}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        </div>
    )
});

export default ContactForm;