import React from 'react';   
import {observer} from 'mobx-react';
import { Row, List, Radio, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import ContactInformationStore from '../stores/ContactInformationStore';
import ShippingMethodStore from '../stores/ShippingMethodStore';
import ProductListStore from '../stores/ProductListStore';
import ShippingContactInfo from './ShippingContactInfo';
import '../css/buttons.css';

const ShippingMethod = observer((props) => {
    const form = props.form;

    const getShippingCost = (country) => {
        const shippingRate = ShippingMethodStore.getShippingRateForCountry(country);
        ProductListStore.setShipping(shippingRate);

        return shippingRate;
    }

    const handleClick = (e) => {
        ProductListStore.checkIfGiftCodeBarShouldShow();
        form.setFields({
            ['giftcode']: { 
                value: ProductListStore.ob.giftCodeSave
            },
        });
    }

    const getContactInfoListItems = () => {
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

        return listItems;
    };

    const getListItems = () => {
        let contactInfo = ContactInformationStore.ob.saveData;
        let shippingData = ShippingMethodStore.ob.method[contactInfo['country']];

        return (
            <List.Item key={"shipping-" + contactInfo['country']}>
                <List.Item.Meta 
                    description={<Radio checked={true}>{shippingData.name + ' - ' + contactInfo['countryName']}</Radio>}
                />
                <div className="cost">{getShippingCost(contactInfo['country'])}</div>
            </List.Item>
        )
    };

    return (
        <div>
            <ShippingContactInfo data={getContactInfoListItems()}/>
            <Row className="section">
                <h2 className="title">Shipping Method</h2>
                <List
                    bordered
                >
                    {getListItems()}
                </List>
                <Row className="sectionFooter" type="flex" justify="space-between">
                    <Link className="back" to='/' onClick={((e) => {handleClick(e)})}><Icon type="left" /> Return to information</Link>
                    <Link to='/payment'><Button className="submit" type="primary" onClick={((e) => {handleClick(e)})}>Continue to payment</Button></Link>
                </Row>
            </Row>
        </div>
    )
});

export default ShippingMethod;