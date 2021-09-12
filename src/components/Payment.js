import React from 'react';   
import {observer} from 'mobx-react-lite';
import { Row, List, Radio, Button, Icon, Collapse, Form, Col, Input, Tooltip } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import ContactInformationStore from '../stores/ContactInformationStore';
import ShippingMethodStore from '../stores/ShippingMethodStore';
import PaymentStore from '../stores/PaymentStore';
import ProductListStore from '../stores/ProductListStore';
import ShippingContactInfo from './ShippingContactInfo';
import ContactForm from './ContactForm';
import '../css/buttons.css';

const images = require.context('../sass/images', true);
const { Panel } = Collapse;
const FormItem = Form.Item;
var valid = require('card-validator');

const Payment = observer((props) => {
    const form = props.form;
    const { getFieldDecorator, getFieldValue } = form;
    const ccinputEditArr = PaymentStore.ob.ccinputEditingMode;

    const handleInputEditing = (inputName, inputLength) => {
        if(inputLength > 0) {
            PaymentStore.setCCInputToEditing(inputName, true);
        }
        else {
            PaymentStore.setCCInputToEditing(inputName, false);
        }
    };

    const getShippingCost = (country) => {
        const shippingRate = ShippingMethodStore.getShippingRateForCountry(country);
        ProductListStore.setShipping(shippingRate);

        return shippingRate;
    }

    const getListItems = () => {
        let listItems = []
        listItems.push(
            Object.keys(ContactInformationStore.ob.saveData).map((key) => {
                if(key === 'email') {
                    return (
                        <List.Item key={"list-" + key}>
                            <List.Item.Meta 
                                title="Contact"
                                description={ContactInformationStore.ob.saveData[key]}
                            />
                            <div className="link"><Link to='/'>Change</Link></div>
                        </List.Item>
                    )
                }
                if(key === 'finalAddress') {
                    return (
                        <List.Item key={"list-" + key}>
                            <List.Item.Meta 
                                title="Ship to"
                                description={ContactInformationStore.ob.saveData[key]}
                            />
                            <div className="link"><Link to='/'>Change</Link></div>
                        </List.Item>
                    )
                }
            })
        );

        let contactInfo = ContactInformationStore.ob.saveData;
        let shippingData = ShippingMethodStore.ob.method[contactInfo['country']];

        listItems.push(
            <List.Item key={"shipping-" + contactInfo['country']}>
                <List.Item.Meta 
                    title="Method"
                    description={
                        shippingData.name + ' - ' + contactInfo['countryName']
                    }
                />
                <div className="cost">{getShippingCost(contactInfo['country'])}</div>
            </List.Item>
        )

        return listItems;
    };

    const getPaymentPanelItems = () => {
        let panelItems = []
        let cardIcons = [];

        cardIcons.push(
            Object.keys(PaymentStore.ob.methods.credit.icons).map((icon) => {
                return (
                    <img 
                        key={icon}
                        className={
                            (PaymentStore.ob.creditCardType.length > 0) ? 
                                ((PaymentStore.ob.creditCardType === icon) ? 'default' : 'grey')
                            : 'default'}

                        src={images(`./${PaymentStore.ob.methods.credit.icons[icon]}.png`)} 
                    />
                )
            }),
            <span className="more" key="creditcard"> and more...</span>
        );

        panelItems.push(
            Object.keys(PaymentStore.ob.methods).map((paymentKey, loopKey) => {
                return(
                    <Panel 
                        showArrow={false}
                        extra={(paymentKey === 'credit') ? cardIcons : ''}
                        key={paymentKey}
                        header={
                        <Radio 
                            value={paymentKey}
                            key={paymentKey + '-radio'}
                            checked={(paymentKey === PaymentStore.ob.selectedRow) ? true: false}
                            onClick={event => {
                                // If you don't want click extra trigger collapse, you can prevent this:
                                event.stopPropagation();
                            }}
                        >
                            {
                                (PaymentStore.ob.methods[paymentKey]['imageIcon'] && PaymentStore.ob.methods[paymentKey]['imageIcon'].length > 0) ? 
                                    <img className="imageLogo" 
                                        key={PaymentStore.ob.methods[paymentKey]['imageIcon']}
                                        src={images(`./${PaymentStore.ob.methods[paymentKey]['imageIcon']}.png`)} /> 
                                    : PaymentStore.ob.methods[paymentKey]['name']
                            }
                        </Radio>} 
                    >

                    {
                        (paymentKey === 'credit') ?
                            Object.keys(PaymentStore.ob.methods[paymentKey]).map((key) => {
                                if(key === 'fields') {
                                    return (
                                        Object.keys(PaymentStore.ob.methods[paymentKey][key]).map((fieldHeader) => {
                                            const fieldValues = PaymentStore.ob.methods[paymentKey][key];
                                            
                                            if(fieldHeader && fieldHeader === 'number') {
                                                const fieldName = fieldValues[fieldHeader]['name'];
                                                
                                                return (
                                                    <Row key={paymentKey + '-' + fieldHeader + '-' + key + '-row'}>
                                                        <Col key={fieldHeader} key={paymentKey + key + '-col'}>
                                                            <FormItem label={fieldName} className={(ccinputEditArr[fieldHeader]) ? 'editing customInput' : 'customInput'} key={paymentKey + key + '-input'}>
                                                                {getFieldDecorator(`payment`+`[${fieldHeader}]`, {
                                                                    initialValue: PaymentStore.ob.ccsaveData.number,
                                                                    rules: [
                                                                        {
                                                                            validator: validateCreditCard
                                                                        },
                                                                    ],
                                                                    getValueFromEvent: e => PaymentStore.cc_format(e.target.value),
                                                                })(
                                                                    <Input
                                                                        key={paymentKey + key + '-input-field'}
                                                                        placeholder=""
                                                                        suffix={<Icon type="lock" />}
                                                                        onChange={(e)=> {
                                                                            handleInputEditing('number', e.target.value.length);
                                                                        }}
                                                                    />
                                                                )}
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                )
                                            }

                                            if(fieldHeader && fieldHeader === 'name') {
                                                const fieldName = fieldValues[fieldHeader]['name'];
                                                
                                                return (
                                                    <Row key={paymentKey + '-' + fieldHeader + '-' + key + '-row'}>
                                                        <Col key={fieldHeader} key={paymentKey + key + '-col'}>
                                                            <FormItem label={fieldName} className={(ccinputEditArr[fieldHeader]) ? 'editing customInput' : 'customInput'} key={paymentKey + key + '-input'}>
                                                                {getFieldDecorator(`payment`+`[${fieldHeader}]`, {
                                                                    initialValue: PaymentStore.ob.ccsaveData.name,
                                                                    rules: [
                                                                        {
                                                                            required: true,
                                                                            whitespace: true, 
                                                                            message: 'Enter your name exactly as it’s written on your card',
                                                                        },
                                                                    ],
                                                                })(
                                                                    <Input
                                                                        key={paymentKey + key + '-input-field'}
                                                                        placeholder=""
                                                                        onChange={(e)=> {
                                                                            handleInputEditing('name', e.target.value.length);
                                                                        }}
                                                                    />
                                                                )}
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                )
                                            }

                                            if(fieldHeader && fieldHeader === 'extra') {
                                                return (
                                                <Row gutter={12} key={paymentKey + '-' + fieldHeader + '-' + key + '-row'}>
                                                {
                                                    Object.keys(PaymentStore.ob.methods[paymentKey][key][fieldHeader]).map((extraKey) => {
                                                        const fieldName = fieldValues[fieldHeader][extraKey]['name'];
                                                        
                                                        return (
                                                            <Col xs={12} md={12} lg={12} xl={12} key={paymentKey + extraKey}>
                                                                <FormItem label={fieldName} className={(ccinputEditArr[extraKey]) ? 'editing customInput' : 'customInput'} key={paymentKey + extraKey + '-input'}>
                                                                    {getFieldDecorator(`payment`+`[${extraKey}]`, {
                                                                        initialValue: PaymentStore.ob.ccsaveData.expiry,
                                                                        rules: [
                                                                            {
                                                                                required: true,
                                                                                whitespace: true, 
                                                                                message: (extraKey === 'security') ? 'Enter the CVV or security code on your card' : 'Enter a card expiry date',
                                                                            },
                                                                        ],
                                                                    })(
                                                                        <Input
                                                                            key={paymentKey + extraKey + '-input-field'}
                                                                            placeholder=""
                                                                            suffix={
                                                                                (extraKey === 'security') ? <Tooltip title="3 or 4 digit security code on the back of your card">
                                                                                    <Icon type="question-circle" />
                                                                                </Tooltip> : ''
                                                                            }
                                                                            onChange={(e)=> {
                                                                                handleInputEditing(extraKey, e.target.value.length);
                                                                            }}
                                                                        />
                                                                    )}
                                                                </FormItem>
                                                            </Col>
                                                        )
                                                    })
                                                }
                                                </Row>
                                                )
                                            }
                                        })
                                    )
                                }
                            })
                        :
                            <div className="emptyContent" key={paymentKey + '-emptyContent'}>
                                <Icon type="export" />
                                <div className="notice">After clicking “Complete order”, you will be redirected to {PaymentStore.ob.methods[paymentKey]['name']} to complete your purchase securely.</div>
                            </div>
                        }
                    </Panel>
                )
            })
        )

        return panelItems;
    }

    const validateCreditCard = (rule, value, callback) => {
        if(value.length <= 0) {
            PaymentStore.ob.creditCardType = '';
            callback("Enter a credit card number");
        }

        else {
            var numberValidation = valid.number(value);
            if(numberValidation.isPotentiallyValid) {
                if('niceType' in numberValidation['card']) {
                    PaymentStore.ob.creditCardType = numberValidation['card']['niceType'].toLowerCase();
                }

                if(numberValidation.isValid) {
                    callback();
                    return;
                }
                else {
                    callback("Enter a valid credit card number");
                }
            } else {
                callback("Enter a valid credit card number");
            }
        }
    };

    const validateInformation = (e) => {
        e.preventDefault();

        form.validateFieldsAndScroll((err, values) => {
            console.log(err)

            if(PaymentStore.ob.selectedAddress !== 'same') {
                if(!err) {
                    console.log('Received values of form: ', values);

                    PaymentStore.setProceedToResults();
                }
            }
            else {
                if(!err || !err['payment']) {
                    console.log('Received values of form: ', values);

                    PaymentStore.setProceedToResults();
                }
            }
        });
    }

    const handleClick = (e) => {
        ProductListStore.checkIfGiftCodeBarShouldShow();
        form.setFields({
            ['giftcode']: { 
                value: ProductListStore.ob.giftCodeSave
            },
        });
        PaymentStore.resetFields();
    }

    const moveToNextPage = () => {
        if(PaymentStore.ob.proceedToResults) {
            PaymentStore.setProceedToResults();
            return <Redirect to='/results' />
        }
    }
    
    return (
        <div>
            <ShippingContactInfo data={getListItems()}/>
            <Row className="section">
                <Form className="paymentForm" hideRequiredMark={true}>
                    <h2 className="title">Payment</h2>
                    <div className="desc">All transactions are secure and encrypted.</div>
                    <div className="creditCardForm">
                        <Collapse 
                            accordion
                            defaultActiveKey={PaymentStore.ob.selectedRow}
                            onChange={(e) => {
                                PaymentStore.ob.selectedRow = e;
                            }}
                        >
                            {getPaymentPanelItems()}
                        </Collapse>
                    </div>

                    <h2 className="title">Billing Address</h2>
                    <div className="billingAddress">
                        <Collapse 
                            accordion
                            defaultActiveKey={PaymentStore.ob.selectedAddress}
                            onChange={(e) => {
                                PaymentStore.ob.selectedAddress = e;
                                console.log(PaymentStore.ob.selectedAddress)
                            }}
                        >
                            <Panel 
                                className="sameAddress"
                                showArrow={false}
                                key={PaymentStore.ob.sameAddressRadio}
                                header={
                                <Radio 
                                    value={PaymentStore.ob.sameAddressRadio}
                                    key={'sameAddress-radio'}
                                    checked={(PaymentStore.ob.selectedAddress === PaymentStore.ob.sameAddressRadio) ? true : false}
                                    onClick={event => {
                                        // If you don't want click extra trigger collapse, you can prevent this:
                                        event.stopPropagation();
                                    }}
                                >
                                    {'Same as shipping address'}
                                </Radio>} 
                            >
                            </Panel>
                            <Panel 
                                className="differentAddress"
                                showArrow={false}
                                key={PaymentStore.ob.differentAddressRadio}
                                header={
                                <Radio 
                                    value={PaymentStore.ob.differentAddressRadio}
                                    key={'differentAddress-radio'}
                                    checked={(PaymentStore.ob.selectedAddress === PaymentStore.ob.differentAddressRadio) ? true : false}
                                    onClick={event => {
                                        // If you don't want click extra trigger collapse, you can prevent this:
                                        event.stopPropagation();
                                    }}
                                >
                                    {'Use a different billing address'}
                                </Radio>} 
                            >
                            <ContactForm store={PaymentStore} form={props.form} fieldData={PaymentStore.ob.saveData} inputEditArr={PaymentStore.ob.inputEditingMode}/>
                            </Panel>
                        </Collapse>
                    </div>

                    <Row className="sectionFooter" type="flex" justify="space-between">
                        <Link className="back" to='/shipping' onClick={((e) => {handleClick(e)})}><Icon type="left" /> Return to shipping</Link>
                        <Link to='/payment'><Button className="submit" onClick={(e) => {validateInformation(e)}} type="primary">Complete order</Button></Link>
                    </Row>
                </Form>
                {moveToNextPage()}
            </Row>
        </div>
    )
});

export default Payment;