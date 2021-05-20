import React from 'react';   
import {observer} from 'mobx-react';
import Image from 'react-image-webp';
import { Link } from 'react-router-dom';

const LogoHeader = () => {
    return(
        <div className="header">
            <Link to={`/`}>
                <Image
                    className="logo" 
                    alt="logo"
                    src={require('../sass/images/boosted-logo.png')}
                    webp={require('../sass/images/boosted-logo.webp')}
                />
            </Link>
        </div>
    )
};

export default LogoHeader;