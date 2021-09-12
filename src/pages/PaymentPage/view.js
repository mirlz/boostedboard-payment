import React from 'react';   
import { Form, Row, Col, Collapse, Icon } from 'antd';
import {observer} from 'mobx-react-lite';
import CommonStore from '../../stores/CommonStore';
import ProductListStore from '../../stores/ProductListStore';
import LogoHeader from '../../components/LogoHeader';
import Breadcrumb from '../../components/Breadcrumb';
import PaymentFooter from '../../components/PaymentFooter';
import ProductList from '../../components/ProductList';
import Payment from '../../components/Payment';

const setCurrentCrumb = '2';
const setPage = 'payment';

const PaymentPage = Form.create()(observer((props) => { 
    const { Panel } = Collapse;

    const addCartIcon = () => {
        return (
            <div>
                <Icon
                    type="shopping-cart"
                />
                <div className="headerprice">
                    {'$' + (CommonStore.convertStringToPrice(ProductListStore.ob.totalPrice.taxes + ProductListStore.ob.totalPrice.subtotal)) }
                </div>
            </div>
        )
    };

    return (     
        <Row className="wrap">
            <div className="mobileTabView">
                <Row className="mobileTabViewWrap" type="flex" justify="center">
                    <Row className="mobileLogo" xs={24} md={24}>
                        <Row type="flex" justify="start">
                            <LogoHeader/>
                        </Row>
                    </Row>
                </Row>
                <Collapse className="mobileTabViewbg" expandIcon={({ isActive }) => <Icon type="down" rotate={isActive ? 180 : 0} />}>
                    <Panel header="Show order summary" key="1" extra={addCartIcon()}>
                        <div className="mobileTabViewbg">
                            <Row className="mobileTabViewWrap" type="flex" justify="center">
                                <Col className="sideBarMobile homePage" xs={24} md={24}>
                                    <Col className="SideBarBg" xs={24} md={24} lg={24} xl={24}>
                                        <Row type="flex" justify="start">
                                            <Col xs={24} md={24} lg={22} xl={18}>
                                                <Col xs={24} md={24} lg={24} xl={21}>
                                                    <div className="sidebar">
                                                        <ProductList form={props.form} currentPage={setPage}/>
                                                    </div>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </div>

            <Col className="leftContainer" xs={24} md={24} lg={14} xl={13}>
                <Row type="flex" justify="end" className="fullHeight">
                    <Col xs={24} md={24} lg={22} xl={17} className="fullHeight">
                        <Col xs={24} md={24} lg={23} xl={22} className="fullHeight">
                            <div className="payment fullHeight">
                                <div className="desktopView">
                                    <LogoHeader/>
                                    <Breadcrumb crumb={setCurrentCrumb}/>
                                </div>
                                <div className="paymentContent main">
                                    <Payment form={props.form}/>
                                </div>
                                <PaymentFooter/>
                            </div>
                        </Col>
                    </Col>
                </Row>
            </Col>
            <Col className="rightContainer" xs={24} md={24} lg={10} xl={11}>
                <Row type="flex" justify="start">
                    <Col xs={24} md={24} lg={22} xl={18}>
                        <Col xs={24} md={24} lg={24} xl={21}>
                            <div className="sidebar">
                                <ProductList form={props.form} currentPage='shipping'/>
                            </div>
                        </Col>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}));

export default PaymentPage;