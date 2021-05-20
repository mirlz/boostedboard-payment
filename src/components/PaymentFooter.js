import React from 'react';   
import {observer} from 'mobx-react';
import Image from 'react-image-webp';
import CommonStore from '../stores/CommonStore';
import { Row, Col, Icon } from 'antd';
import { Link } from 'react-router-dom';

const PaymentFooter = () => {
    return (
        <div className="paymentFooter">
            <div className="policyContent">
                <Row className="links">
                    <Col xs={4} md={4} lg={4} xl={4}>
                        <Link to={`/`}>Refund Policy</Link>
                    </Col>
                    <Col xs={4} md={4} lg={4} xl={4}>
                        <Link to={`/`}>Privacy Policy</Link>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        *I agree to receive recurring automated text messages at the phone number provided. Consent is not a condition to purchase. Msg & data rates may apply. Click to view our Terms of Service.
                    </Col>
                </Row>
            </div>
        </div>
    )
};

export default PaymentFooter;
