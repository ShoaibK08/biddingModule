import React from 'react';
import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import KYC from './KYCVerification';

const KYCVerification = () => {
    document.title ="Raise Indent | Nayara - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Raise Indent" pageTitle="Master" />
                    <Row>
                        <KYC />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default KYCVerification;