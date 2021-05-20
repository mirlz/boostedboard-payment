import React from 'react';   
import {observer} from 'mobx-react';
import { List } from 'antd';

const ShippingContactInfo = observer((props) => {
    const dataSource = props.data;
    
    return (
        <div>
            <List
                size="small"
                bordered
            >
                {dataSource}
            </List>
        </div>
    )
});

export default ShippingContactInfo;