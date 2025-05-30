import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    UncontrolledCollapse,
    UncontrolledDropdown,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";
import axios from "axios";

// RangeSlider

import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { useSelector, useDispatch } from "react-redux";

import { expolreNow } from "../../../common/data/index";

//import action
import {
    getTeamData as onGetTeamData,
} from "../../../store/actions";


const ExploreNow = () => {
    document.title = "Material List | Material List";
    //const [NFTList, setNFTList] = useState(expolreNow);

    const favouriteBtn = (ele) => {
        if (ele.closest("button").classList.contains("active")) {
            ele.closest("button").classList.remove("active");
        } else {
            ele.closest("button").classList.add("active");
        }
    };


    const [NFTList, setNFTList] = useState([]);

    const dispatch = useDispatch();

    const { teamData } = useSelector((state) => ({
        teamData: state.Team.teamData,
    }));

    const onUpdate = (value) => {
        setNFTList(
            teamData.filter(
                (NFT) => NFT.price >= value[0] && NFT.price <= value[1],
            )
        );
    };

    const category = (e) => {
        setNFTList(
            Items.filter((item) => item.material_category === e));
    };

    const fileType = (e) => {
        setNFTList(
            Items.filter((item) => item.fileType === e));
    };

    const salesType = (e) => {
        setNFTList(
            teamData.filter((item) => item.sales === e));
    };

    const searchNFT = () => {
        var searchProductList = document.getElementById("searchProductList");
        var inputVal = searchProductList.value.toLowerCase();
        function filterItems(arr, query) {
            return arr.filter(function (el) {
                return el.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            });
        }
        var filterData = filterItems(teamData, inputVal);
        if (filterData.length === 0) {
            document.getElementById("noresult").style.display = "block";
            document.getElementById("loadmore").style.display = "none";
        } else {
            document.getElementById("noresult").style.display = "none";
            document.getElementById("loadmore").style.display = "block";
        }
        setNFTList(filterData);
    };

    useEffect(() => {
        // dispatch(onGetTeamData());
    }, [dispatch]);

    useEffect(() => {
        setNFTList(teamData);
    }, [teamData]);

    const [totalCounts, setTotalCount] = useState([]);
    const [Items, setItems] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    //setting tha initial page
    const [page, setPage] = useState(0);

    const useInfiniteScroll = (callback, isFetching) => {
        //here we use useRef to store a DOM node and the returned object will persist regardless of re-renders
        const observer = useRef();

        //useCallback takes a callback argument and an array dependency list and returns a memoized callback
        //which is guaranteed to have the same reference
        const lastElementRef = useCallback(
            (node) => {
                if (isFetching) return;

                //stop watching targets, you can think of it as a reset
                if (observer.current) observer.current.disconnect();

                //create a new intersection observer and execute the callback incase of an intersecting event
                observer.current = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        callback();
                    }
                });

                //if there is a node, let the intersection observer watch that node
                if (node) observer.current.observe(node);
            },
            [callback, isFetching]
        );

        //return reference to the last element
        return [lastElementRef];
    };

    //we need to know if there is more data
    const [HasMore, setHasMore] = useState(true);

    const [lastElementRef] = useInfiniteScroll(
        HasMore ? loadMoreItems : () => { },
        isFetching
    );

    //on initial mount
    useEffect(() => {
        loadMoreItems();
    }, []);

    function loadMoreItems() {
        setIsFetching(true);

        //using axios to access the third party API
        axios({
            method: "GET",
            url: "http://localhost:8043/sapModule/getAllMaterialByPagination",
            params: { pageNO: page, pageSize: 8 },
        })
            .then((res) => {
                console.log(res)
                setItems((prevTitles) => {
                    return [...new Set([...prevTitles, ...res.content])];
                });
                setPage((prevPageNumber) => prevPageNumber + 1);
                setTotalCount(res.totalElements);
                setHasMore(res.content.length > 0);
                setIsFetching(false);
            })
            .catch((e) => {
                console.log(e);
            });
    }



    //console.log(teamData)


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Material List" pageTitle="Master" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader className="border-0">
                                    <div className="d-flex align-items-center">
                                        <h5 className="card-title mb-0 flex-grow-1">
                                            All Materials
                                        </h5>
                                        <div>
                                            <Link color="info" to="/apps-nft-explore" className="btn btn-soft-info nav-link btn-icon fs-14 active filter-button"><i className="ri-grid-fill"></i></Link>
                                            {" "}
                                            <Link color="info" to="/apps-ecommerce-orders" className="btn btn-soft-info nav-link  btn-icon fs-14 filter-button"><i className="ri-list-unordered"></i></Link>
                                            {" "}
                                            <Link color="info" to="/dashboard-projects" className="btn btn-soft-info nav-link  btn-icon fs-14 filter-button"><i className="mdi mdi-chart-bar"></i></Link>
                                            {" "}
                                            <Link color="info" to="/apps-calendar" className="btn btn-soft-info nav-link  btn-icon fs-14 filter-button"><i className="mdi mdi-calendar"></i></Link>
                                            {" "}
                                            <Link
                                                to="/apps-ecommerce-add-product"
                                                className="btn btn-success"
                                            >
                                                <i className="ri-add-line align-bottom me-1"></i> Add
                                                Material
                                            </Link>{" "}
                                            <Link
                                                className="btn btn-success"
                                                id="filter-collapse"
                                                data-bs-toggle="collapse"
                                                to="#collapseExample"
                                            >
                                                <i className="ri-filter-2-line align-bottom"></i>
                                                Filters
                                            </Link>
                                        </div>
                                    </div>

                                    <UncontrolledCollapse toggler="#filter-collapse" defaultOpen>
                                        <Row className="row-cols-xxl-5 row-cols-lg-3 row-cols-md-2 row-cols-1 mt-3 g-3">
                                            <Col>
                                                <h6 className="text-uppercase fs-12 mb-2">Search</h6>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search product name"
                                                    autoComplete="off"
                                                    id="searchProductList"
                                                    onKeyUp={searchNFT}
                                                />
                                            </Col>
                                            <Col>
                                                <h6 className="text-uppercase fs-12 mb-2">
                                                    Select Category
                                                </h6>
                                                <select
                                                    className="form-control"
                                                    data-choices
                                                    name="select-category"
                                                    data-choices-search-false
                                                    id="select-category"
                                                    onChange={(e) => category(e.target.value)}
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="Artwork">Artwork</option>
                                                    <option value="3d Style">3d Style</option>
                                                    <option value="Photography">Photography</option>
                                                    <option value="Collectibles">Collectibles</option>
                                                    <option value="Crypto Card">Crypto Card</option>
                                                    <option value="Games">Games</option>
                                                    <option value="Music">Music</option>
                                                </select>
                                            </Col>
                                            <Col>
                                                <h6 className="text-uppercase fs-12 mb-2">Select Tag</h6>
                                                <select
                                                    className="form-control"
                                                    data-choices
                                                    name="file-type"
                                                    data-choices-search-false
                                                    id="file-type"
                                                    onChange={(e) => fileType(e.target.value)}
                                                >
                                                    <option value="">File Type</option>
                                                    <option value="jpg">Images</option>
                                                    <option value="mp4">Video</option>
                                                    <option value="mp3">Audio</option>
                                                    <option value="gif">Gif</option>
                                                </select>
                                            </Col>
                                        </Row>
                                    </UncontrolledCollapse>
                                </CardHeader>
                            </Card>
                        </Col>
                        <div className="align-items-center mb-6" style={{ marginTop: '-15px' }}>
                            <div class=" ribbon-box  mb-lg-0"><div class="ribbon ribbon-primary ribbon-shape">Total Results : {totalCounts}</div></div>
                            {/* <div className="flex-shrink-0">
                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            tag="a"
                                            className="text-muted fs-14"
                                            role="button"
                                        >
                                            All View <i className="mdi mdi-chevron-down"></i>
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-end">
                                            <DropdownItem to="#">Action</DropdownItem>
                                            <DropdownItem to="#">Another action</DropdownItem>
                                            <DropdownItem to="#">Something else here</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div> */}
                        </div>
                    </Row>
                    <Row
                        className="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1"
                        id="explorecard-list" style={{ marginTop: '30px' }}
                    >
                        {Items.map((item, key) => {
                            if (Items.length === key + 1) {

                                return (
                                    <div ref={lastElementRef} key={key}>
                                        <Col className="list-element" key={key}>
                                            <Card className="explore-box card-animate box_shadow">
                                                <div className="explore-place-bid-img">
                                                    <input type="hidden" className="form-control" id="1" />
                                                    <div className="d-none">undefined</div>
                                                    <img
                                                        src={process.env.PUBLIC_URL + "/subImage/" + item.image[0]}
                                                        alt=""
                                                        className="card-img-top explore-img img_style"
                                                        style={{ height: '150px' }}
                                                    />
                                                    <div className="bg-overlay"></div>
                                                    <div className="place-bid-btn">

                                                        <Link to={'/apps-ecommerce-product-details/' + item.material_code} className="btn btn-success">
                                                            <i className="ri-auction-fill align-bottom me-1"></i> View
                                                        </Link>
                                                    </div>
                                                </div>
                                                <CardBody>
                                                    <h5 className="mb-1">
                                                        <Link to="/apps-nft-item-details"><b>Name : </b>{item.material_name}</Link>
                                                    </h5>
                                                    <p className="text-muted mb-0"><b>Description : </b>{item.material_category}</p>
                                                </CardBody>
                                                <div className="card-footer border-top border-top-dashed box_shadow">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 fs-14">

                                                            <i className="ri-price-tag-3-fill text-warning align-bottom me-1"></i>
                                                            MATERIAL CODE: <span className="fw-medium">{item.material_code}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Col>
                                    </div>
                                );

                            } else {
                                return (<Col className="list-element" key={key}>
                                    <Card className="explore-box card-animate box_shadow" >
                                        <div className="explore-place-bid-img">
                                            <input type="hidden" className="form-control" id="1" />
                                            <div className="d-none">undefined</div>
                                            <img
                                                src={process.env.PUBLIC_URL + "/subImage/" + item.image[0]}
                                                alt=""
                                                className="card-img-top explore-img img_style"
                                                style={{ height: '150px' }}
                                            />
                                            <div className="bg-overlay"></div>
                                            <div className="place-bid-btn">

                                                <Link to={'/apps-ecommerce-product-details/' + item.material_code} className="btn btn-success">
                                                    <i className="ri-auction-fill align-bottom me-1"></i> View
                                                </Link>
                                            </div>
                                        </div>
                                        <CardBody className="borer_dashed">
                                            <h5 className="mb-1">
                                                <Link to="/apps-nft-item-details"><b>Name : </b>{item.material_name}</Link>
                                            </h5>
                                            <p className="text-muted mb-0"><b>Description : </b>{item.material_category}</p>
                                        </CardBody>
                                        <div className="card-footer border-top border-top-dashed box_shadow">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1 fs-14">

                                                    <i className="ri-price-tag-3-fill text-warning align-bottom me-1"></i>
                                                    MATERIAL CODE: <span className="fw-medium">{item.material_code}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                );
                            }
                        })}
                        {isFetching && <div className="text-center mb-3">
                            <button className="btn btn-link text-success mt-2" id="loadmore">
                                <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2"></i>
                                Load More
                            </button>
                        </div>}
                    </Row>
                    <div
                        className="py-4 text-center"
                        id="noresult"
                        style={{ display: "none" }}
                    >
                        <lord-icon
                            src="https://cdn.lordicon.com/msoeawqm.json"
                            trigger="loop"
                            colors="primary:#405189,secondary:#0ab39c"
                            style={{ width: "72px", height: "72px" }}
                        ></lord-icon>
                        <h5 className="mt-4">Sorry! No Result Found</h5>
                    </div>

                </Container>
            </div>
        </React.Fragment>
    );
};

export default ExploreNow;
