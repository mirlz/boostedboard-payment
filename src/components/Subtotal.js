import React from 'react';   
import {observer} from 'mobx-react';
import CommonStore from '../stores/CommonStore';
import { Row, Col } from 'antd';
import ProductListStore from '../stores/ProductListStore';
import CountriesStatesStore from '../stores/CountriesStatesStore';

const Subtotal = observer((props) => {
    const currentPage = props.currentPage;

    return (
        <div>
            <div className="subtotalSection">
                <Row type="flex" justify="space-between">
                    <Col xs={12} md={12} lg={12} xl={12}>
                        <div className="title">Subtotal</div>
                    </Col> 
                    <Col xs={12} md={12} lg={12} xl={12}>
                        <Row type="flex" justify="end" className="value">
                            {'$' + CommonStore.convertStringToPrice(ProductListStore.ob.totalPrice.subtotal)}
                        </Row>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between">
                    <Col xs={12} md={12} lg={12} xl={12}>
                        <div className="title">Shipping</div>
                    </Col> 
                    <Col xs={12} md={12} lg={12} xl={12}>
                        <Row type="flex" justify="end" className="shippingValue value">
                            {
                                (ProductListStore.ob.totalPrice.shipping === 0 || currentPage ==='home') ? 
                                <div className="defaultShip">Calculated at next step</div>
                                :
                                ProductListStore.ob.totalPrice.shipping
                            }
                        </Row>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between"
                    className={(CountriesStatesStore.ob.verifiedZipCode && CommonStore.convertStringToPrice(ProductListStore.ob.totalPrice.taxes) > 0) ||
                    (CountriesStatesStore.ob.onStateSelectChange && CommonStore.convertStringToPrice(ProductListStore.ob.totalPrice.taxes) > 0) ? '' : 'hidden'}>
                    <Col xs={12} md={12} lg={12} xl={12}>
                        <div className="title">Taxes</div>
                    </Col> 
                    <Col xs={12} md={12} lg={12} xl={12}>
                        <Row type="flex" justify="end" className="value">
                            { 
                                '$' + CommonStore.convertStringToPrice(ProductListStore.ob.totalPrice.taxes) 
                            }
                        </Row>
                    </Col>
                </Row>
            </div>
            <div className="totalSection">
                <Row type="flex" justify="space-between">
                    <Col xs={12} md={12} lg={12} xl={12}>
                        <div className="title">Total</div>
                    </Col> 
                    <Col xs={12} md={12} lg={12} xl={12}>
                        <Row type="flex" justify="end">
                            <span className="currency">USD</span>
                            <span className="value">
                                {'$' + (CommonStore.convertStringToPrice(ProductListStore.ob.totalPrice.taxes + ProductListStore.ob.totalPrice.subtotal)) }
                            </span>
                        </Row>
                    </Col> 
                </Row>
            </div>
        </div>
    )
});

export default Subtotal;