import React from 'react';
import ContactInfoPage from '../pages/ContactInfoPage/view';
import ShippingMethodsPage from '../pages/ShippingMethodsPage/view';
import PaymentPage from '../pages/PaymentPage/view';
import ResultsPage from '../pages/ResultsPage/view';
import { Switch, Route } from 'react-router-dom';

const Main = () => { 
    return (
        <Switch>
            <Route exact path='/' component={ContactInfoPage} />
            <Route exact path='/shipping' component={ShippingMethodsPage} />
            <Route exact path='/payment' component={PaymentPage} />
            <Route exact path='/results' component={ResultsPage} />
        </Switch>
    )
};

export default Main;