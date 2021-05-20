import React from 'react';   
import {observer} from 'mobx-react';
import CommonStore from '../stores/CommonStore';
import { Row, Col, Form, Input, Button } from 'antd';
import ProductListStore from '../stores/ProductListStore';
import AffirmLogo from '../sass/images/blue_logo-transparent_bg.png';
import Subtotal from './Subtotal';

const images = require.context('../sass/images', true);
const FormItem = Form.Item;

const ProductList = observer((props) => {
    const form = props.form;
    const { getFieldDecorator, getFieldValue } = form;
    const productData = ProductListStore.ob.data;
    const inputEditArr = ProductListStore.ob.inputEditingMode;

    const handleGiftCodeClick = () => {
        ProductListStore.showGiftCodeBar(true);
    }

    const handleInputEditing = (inputName, inputLength) => {
        if(inputLength > 0) {
            ProductListStore.setInputToEditing(inputName, true);
        }
        else {
            ProductListStore.setInputToEditing(inputName, false);
        }
    };

    const validateGiftCode = (rule, value, callback) => {
        if(value.length <= 0) {
            ProductListStore.ob.disableGiftCodeButton = true;
            callback();
        }

        else {
            ProductListStore.ob.disableGiftCodeButton = false;
            callback();
            return;
        }
    }

    const saveGiftCode = () => {
        let giftcode = form.getFieldValue('giftcode');

        ProductListStore.ob.giftCodeSave = giftcode;
    }

    return (
        <div>
            <div className="productList">
                {
                    Object.keys(productData).map((productno, key) => {
                        return (
                            <Row className="productListItem" key={productno}>
                            {
                                Object.keys(productData[productno]).map((productKey, key2) => {
                                    if(productKey === 'img') {
                                        let filename = productData[productno][productKey];
                                        return (
                                            <Col xs={5} md={5} lg={5} xl={5} key={productno + '-' + productKey}>
                                                <img
                                                    className="productImg" 
                                                    alt="productImg"
                                                    src={images(`./${filename}.png`)}
                                                />
                                            </Col>
                                        )
                                    }
                                    if(productKey === 'title') {
                                        let title = productData[productno][productKey];
                                        return (
                                            <Col xs={15} md={15} lg={15} xl={15} className="title" key={productno + '-' + productKey}>
                                            {
                                                Object.keys(title).map((titleKey, key3) => {
                                                    if(titleKey === 'name') {
                                                        return (
                                                            <Row key={productno + '-'+ titleKey} className="productName">
                                                                {title[titleKey]}
                                                            </Row>
                                                        )
                                                    }
                                                    if(titleKey === 'eta') {
                                                        return (
                                                            <Row key={productno + '-'+ titleKey} className="productEta">
                                                                {title[titleKey]}
                                                            </Row>
                                                        )
                                                    }
                                                })
                                            }
                                            </Col>
                                        )
                                    }
                                    if(productKey === 'price') {
                                        let price = productData[productno][productKey];
                                        return (
                                            <Col xs={4} md={4} lg={4} xl={4} key={productno + '-' + productKey}>
                                                <Row 
                                                    type="flex" 
                                                    justify="end" 
                                                    className="productPrice"
                                                    key={productno+'-'+productKey}
                                                >
                                                    {'$' + CommonStore.convertStringToPrice(price)}
                                                </Row>
                                            </Col>
                                        )
                                    }
                                    if(productKey === 'qty') {
                                        let qty = productData[productno][productKey];
                                        return (
                                            <div key={productno+'-'+productKey} className="qty">{qty}</div>
                                        )
                                    }
                                })
                            }
                            </Row>
                        )
                    })
                }
            </div>
            <div className="notes">
                <p>Notes about your order</p>
                <ul>
                    <li className="affirm"><span className="bold">Limited Time Offer</span>: Looking for <img src={AffirmLogo}/> 0% APR financing?</li>
                    <li>Your dragon will ship in 1-2 business days.</li>
                    <li>Dragon delivery will require a direct signature.</li>
                    <li>We’ll send you a separate shipping confirmation email when your dragon start its journey.</li>
                    <li>Direct signature required upon arrival of your dragon.</li>
                </ul>
            </div>
            <div className="giftCode">
                <div 
                    className={(ProductListStore.ob.giftCodeSave.length > 0 || ProductListStore.ob.showGiftCode) ? 'hidden' : 'line'}
                    onClick={()=>{
                        handleGiftCodeClick()
                    }}>
                    Have a gift card or discount code?
                </div>
                <div className={(ProductListStore.ob.giftCodeSave.length > 0 || ProductListStore.ob.showGiftCode) ? 'giftCodeBar' : 'hidden'}>
                    <Form className="giftCodeForm" hideRequiredMark={true}>
                        <Row key="giftcode" gutter={12}>
                            <Col xs={18} md={18} lg={18} xl={18}>
                                <FormItem label="Gift card or discount code" className={(inputEditArr.giftcode) ? 'editing customInput' : 'customInput'}>
                                    {getFieldDecorator('giftcode', {
                                        rules: [{validator: validateGiftCode }],
                                        initialValue: ProductListStore.ob.giftCodeSave,
                                    })(
                                        <Input
                                            placeholder=""
                                            onChange={(e)=> {
                                                handleInputEditing('giftcode', e.target.value.length);
                                                ProductListStore.ob.giftCodeSaveTemp = e.target.value;
                                            }}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={6}>
                                <FormItem>
                                    <Button 
                                        className="submit" 
                                            type="primary" 
                                            disabled={(ProductListStore.ob.giftCodeSave.length > 0 || ProductListStore.ob.giftCodeSaveTemp.length > 0) ? false : true}
                                            onClick={() => {
                                                saveGiftCode();
                                            }}
                                        >
                                        Apply
                                    </Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
            <Subtotal currentPage={props.currentPage}/>
        </div>
    )
});

export default ProductList;