import React from 'react';
import { Spinner } from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Common/Loader_new.scss'

const LoaderNew = (props) => {
    return (
        <React.Fragment>
            <div className='overlay' style={{zIndex:"9999"}}>
            <div style={{position:"absolute", top:"50%", left:"50%"}}>
                <Spinner color="primary"> Loading... </Spinner>
            </div>
            </div>
        </React.Fragment>
    );
};

export default LoaderNew;
