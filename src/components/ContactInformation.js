import React from 'react';   
import {observer} from 'mobx-react';
import { Redirect } from 'react-router-dom';
import ContactInformationStore from '../stores/ContactInformationStore';
import CountriesStatesStore from '../stores/CountriesStatesStore';
import { Row, Col, Form, Input, Checkbox, Button } from 'antd';
import ContactForm from './ContactForm';
import ProductList from './ProductList';
import ProductListStore from '../stores/ProductListStore';

const FormItem = Form.Item;

const ContactInformation = observer((props) => {
    const form = props.form;
    const { getFieldDecorator, getFieldValue } = form;
    const inputEditArr = ContactInformationStore.ob.inputEditingMode;
    const countryData = CountriesStatesStore.ob.countries;

    const handleInputEditing = (inputName, inputLength) => {
        if(inputLength > 0) {
            ContactInformationStore.setInputToEditing(inputName, true);
        }
        else {
            ContactInformationStore.setInputToEditing(inputName, false);
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();

        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const formValues = values['contact'];
                Object.keys(formValues).map((key) => {
                    if(key in ContactInformationStore.ob.saveData) {
                        ContactInformationStore.ob.saveData[key] = formValues[key];
                    }
                });
                ContactInformationStore.ob.saveData.countryName = countryData[formValues['country']].name;
                let finalAdd ='';
                
                if((formValues['company'].trim()).length >0) {
                    finalAdd += formValues['company'] + ', ';
                }
                finalAdd += formValues['address'] + ', ';
                if((formValues['apartment'].trim()).length >0) {
                    finalAdd += formValues['apartment'] + ', ';
                }
                finalAdd += formValues['city'] + ', ';
                finalAdd += formValues['zipcode'] + ', ';
                finalAdd += ContactInformationStore.ob.saveData.countryName;

                ContactInformationStore.ob.saveData.finalAddress = finalAdd;

                ContactInformationStore.setProceedToShipping();
            }
        });

        ProductListStore.checkIfGiftCodeBarShouldShow();
        form.setFields({
            ['giftcode']: { 
                value: ProductListStore.ob.giftCodeSave
            },
        });
        console.log(ContactInformationStore.ob.saveData)
    }

    const moveToNextPage = () => {
        if(ContactInformationStore.ob.proceedToShipping) {
            ContactInformationStore.setProceedToShipping();
            return <Redirect to='/shipping' />
        }
    }

    return (
        <div>
            <Form className="contactForm" hideRequiredMark={true}>
                <Row className="section">
                    <Row className="title">Contact Information</Row>
                    <Col key="email">
                        <FormItem label="Email" className={(inputEditArr.email || ContactInformationStore.ob.saveData.email.length > 0 ) ? 'editing customInput' : 'customInput'}>
                            {getFieldDecorator(`contact`+`[email]`, {
                                initialValue: ContactInformationStore.ob.saveData.email,
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'Enter a valid email',
                                    },
                                    {
                                        required: true,
                                        whitespace: true, 
                                        message: 'Please enter your Email',
                                    },
                                ],
                            })(
                                <Input
                                    placeholder=""
                                    onChange={(e)=> {
                                        ContactInformationStore.ob.saveData.email =  e.target.value;
                                        handleInputEditing('email', e.target.value.length);
                                    }}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Checkbox 
                        checked={ContactInformationStore.ob.saveData.checkSubscribe}
                        onChange={(e) => {
                            ContactInformationStore.setCheckSubscribe(e.target.checked)
                        }}
                    >Keep me up to date on news and exclusive offers by email and/or text messages*</Checkbox>
                </Row>
                <ContactForm form={props.form} store={ContactInformationStore} fieldData={ContactInformationStore.ob.saveData} inputEditArr={ContactInformationStore.ob.inputEditingMode}/>
                {moveToNextPage()}
                <Row className="sectionFooter" type="flex" justify="end">
                    <Button className="submit" type="primary" onClick={((e) => {handleSubmit(e)})}>Continue to shipping</Button>
                </Row>
            </Form>
        </div>
    )
});

export default ContactInformation;