import React from 'react';
import { Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../Components/Common/BreadCrumb";

    const Reports_Quota_Utilization = () => {
        document.title = "New Page | Velzon - React Admin & Dashboard Template";   //for meta title
        return (
            <>
                <div className="page-content test">
                    <Container fluid={true}>
                        <Breadcrumbs title="New Page" breadcrumbItem="New Page" />
                        
                            //write Html code or structure Reports_Quota_Utilization

                    </Container>
                </div>
            </>
        );
    }


export default Reports_Quota_Utilization;