import React from 'react';   
import {observer} from 'mobx-react';
import CommonStore from '../stores/CommonStore';
import { Row, Col, Icon } from 'antd';
import { Link } from 'react-router-dom';

const Breadcrumb = observer((props) => {
    const statuses = CommonStore.ob.breadcrumbs;
    const crumb = Number(props.crumb);

    return(
        <div className="header">
            <Row className="breadcrumbs">
                {
                    Object.keys(statuses).map((status,key) => {
                        return (
                            <Col className={(crumb === statuses[status].id ? 'active crumbs' : 'crumbs')} key={statuses[status].id}>
                                {statuses[status].name}
                                {(key !== Object.keys(statuses).length-1) ? ( <Icon type="right" />) : ''}
                            </Col>
                        )
                    })
                }
                <div className="clear"></div>
            </Row>
        </div>
    )
});

export default Breadcrumb;