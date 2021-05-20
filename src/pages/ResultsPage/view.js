import React from 'react';   
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import {observer} from 'mobx-react';
import ContactInformationStore from '../../stores/ContactInformationStore';
import ProductListStore from '../../stores/ProductListStore';
import PaymentStore from '../../stores/PaymentStore';

const ResultsPage = observer((props) => {
    const onClickButton = () => {
        ContactInformationStore.resetFields();
        PaymentStore.resetFields();
    }

    return (
        <Result
            status="success"
            title="Successfully Purchased items!"
            subTitle={'Order number: ' + Date.now() + ' has been placed! '}
            extra={[
                <Link to='/' key="backToHome"><Button onClick={() => {onClickButton()}} type="primary" key="buy">Buy Again</Button></Link>,
            ]}
        />
    )
});

export default ResultsPage; 