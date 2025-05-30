import React, { Fragment, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useRowSelect
} from "react-table";
import { Table, Row, Col, Button, Input, CardBody, Nav, NavItem, NavLink, Card} from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import {
  ProductsGlobalFilter,
  CustomersGlobalFilter,
  IndentStatusFilter,
  ReportIndentFilter,
  DateReportIndentFilter,
  ReportScheduledFilter,
  OrderGlobalFilter,
  ContactsGlobalFilter,
  CompaniesGlobalFilter,
  LeadsGlobalFilter,
  CryptoOrdersGlobalFilter,
  InvoiceListGlobalSearch,
  TicketsListGlobalFilter,
  NFTRankingGlobalFilter,
  TaskListGlobalFilter,
} from "../../Components/Common/GlobalSearchFilter";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isCustomerFilter,
  isStatusFilter,
  isReportIndentFilter,
  idDateFilter,
  isReportScheduledFilter,
  isOrderFilter,
  isContactsFilter,
  isCompaniesFilter,
  isCryptoOrdersFilter,
  isInvoiceListFilter,
  isTicketsListFilter,
  isNFTRankingFilter,
  isTaskListFilter,
  isProductsFilter,
  isLeadsFilter,
  SearchPlaceholder
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  const ActiveDeactiveTab = () => {
    const classNameUse = document.getElementsByClassName("commonThemeClass")[0];
    if (classNameUse.style.display == "none") {
      document.getElementsByClassName("commonThemeClass")[0].style.display = "block";
      //document.getElementsByClassName("commonThemeClass")[0].style.left = "585px";
      if (window.location.pathname === "/report-pmr") {
        document.getElementsByClassName("commonThemeClass")[0].style.top = "300px";
      }
      else if (window.location.pathname === "/tagMapping" || window.location.pathname === "/tolerance") {
        document.getElementsByClassName("commonThemeClass")[0].style.top = "250px";
      }
      else if (window.location.pathname === "/weight-approve") {
        document.getElementsByClassName("commonThemeClass")[0].style.top = "215px";
      }
      else if (window.location.pathname === "/report-csr") {
        document.getElementsByClassName("commonThemeClass")[0].style.top = "90px";
      }
      // else{
      //   document.getElementsByClassName("commonThemeClass")[0].style.top = "76px";
      // }

    } else {
      document.getElementsByClassName("commonThemeClass")[0].style.display = "none";
    }
  };

  return (
    <React.Fragment>
      <div className="col-sm-8 search_con">
        <form>
          <Row>
            <Col sm={8}>
              <div className={(isProductsFilter || isContactsFilter || isCompaniesFilter || isNFTRankingFilter) ? "search-box me-2 mb-2 d-inline-block" : "search-box me-2 mb-2 d-inline-block col-12"}>
                {/* <input
                  onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                  }}
                  id="search-bar-0"
                  type="text"
                  className="form-control search /"
                  placeholder={SearchPlaceholder}
                  value={value || ""}
                /> */}
                <input
                  onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevent default form submission
                      // Optionally, you can trigger the search function here
                      // Example: searchFunction(value);
                    }
                  }}
                  id="search-bar-0"
                  type="text"
                  className="form-control search"
                  placeholder={SearchPlaceholder}
                  value={value || ""}
                />
                <i className="bx bx-search-alt search-icon"></i>
              </div>
            </Col>
            {window.location.pathname === "/report-csr" || window.location.pathname === "/report-pmr" ? (
              <Col sm={4}>
                <ul style={{ listStyle: "none", padding: "0", fontSize: "11px", margin: "0" }}>
                  <li>
                    <span className="badge bg-success text-success align-middle rounded-pill ms-1">M</span> <label>AUTO</label>
                    <span className="badge bg-primary text-primary align-middle rounded-pill ms-1">M</span> <label>SAP</label>
                    {window.location.pathname === "/report-csr" && (
                      <>
                        <span className="badge align-middle rounded-pill ms-1" style={{ background: "red", color: "red" }}>M</span> <label>PRIORITY</label>
                      </>
                    )
                    }
                  </li>
                  <li>
                    <span className="badge bg-warning text-warning align-middle rounded-pill ms-1">M</span> <label>BCP</label>
                    <span className="badge bg-danger text-danger align-middle rounded-pill ms-1">M</span> <label>GEOFENCING</label>
                  </li>
                </ul>
              </Col>
            ) : null}
            {idDateFilter && (
              <DateReportIndentFilter />
            )}


            {/* Previous Toggle Button */}




            {isProductsFilter && (
              <ProductsGlobalFilter />
            )}
            {isCustomerFilter && (
              <CustomersGlobalFilter />
            )}
            {isStatusFilter && (
              <IndentStatusFilter />
            )}
            {isReportIndentFilter && (
              <ReportIndentFilter />
            )}
            {isReportScheduledFilter && (
              <ReportScheduledFilter />
            )}
            {isOrderFilter && (
              <OrderGlobalFilter />
            )}
            {isContactsFilter && (
              <ContactsGlobalFilter />
            )}
            {isCompaniesFilter && (
              <CompaniesGlobalFilter />
            )}
            {isLeadsFilter && (
              <LeadsGlobalFilter />
            )}
            {isCryptoOrdersFilter && (
              <CryptoOrdersGlobalFilter />
            )}
            {isInvoiceListFilter && (
              <InvoiceListGlobalSearch />
            )}
            {isTicketsListFilter && (
              <TicketsListGlobalFilter />
            )}
            {isNFTRankingFilter && (
              <NFTRankingGlobalFilter />
            )}
            {isTaskListFilter && (
              <TaskListGlobalFilter />
            )}
          </Row>


        </form>

      </div>


    </React.Fragment>
  );
}

//Dheeraj
const TableContainer = ({
  columns,
  data,
  isGlobalSearch,
  isGlobalFilter,
  isProductsFilter,
  isCustomerFilter,
  isStatusFilter,
  isReportIndentFilter,
  isReportScheduledFilter,
  isOrderFilter,
  isContactsFilter,
  isCompaniesFilter,
  isLeadsFilter,
  isCryptoOrdersFilter,
  isInvoiceListFilter,
  isTicketsListFilter,
  isNFTRankingFilter,
  isTaskListFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  manualTR,
  thClass,
  divClass,
  SearchPlaceholder
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    allColumns,
    getToggleHideAllColumnsProps,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: 5,
        // pageSize: customPageSize,
        selectedRowIds: 0,
        sortBy: [{ desc: true }],
      },
      globalFilter: (rows, columnIds, filterValue) => {
        if (!filterValue) return rows;
        const searchTerms = filterValue.split(' ').filter(Boolean);
        return rows.filter(row => {
          return searchTerms.every(term => {
            return columnIds.some(columnId => {
              const cellValue = row.values[columnId];
              return String(cellValue).toLowerCase().includes(term.toLowerCase());
            });
          });
        });
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " " : "") : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };
  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  // const test = "test";
  // const ActiveDeactiveTab = () => {
  //   const classNameUse = document.getElementsByClassName("commonThemeClass")[0];
  //   if (classNameUse.style.display == "none") {
  //     document.getElementsByClassName("commonThemeClass")[0].style.display = "block";
  //     //document.getElementsByClassName("commonThemeClass")[0].style.left = "585px";
  //     if (window.location.pathname === "/report-pmr") {
  //       document.getElementsByClassName("commonThemeClass")[0].style.top = "300px";
  //     }
  //     else if (window.location.pathname === "/tagMapping" || window.location.pathname === "/tolerance") {
  //       document.getElementsByClassName("commonThemeClass")[0].style.top = "250px";
  //     }
  //     else if (window.location.pathname === "/weight-approve") {
  //       document.getElementsByClassName("commonThemeClass")[0].style.top = "215px";
  //     }
  //     else if (window.location.pathname === "/report-csr") {
  //       document.getElementsByClassName("commonThemeClass")[0].style.top = "90px";
  //     }
  //     // else{
  //     //   document.getElementsByClassName("commonThemeClass")[0].style.top = "76px";
  //     // }

  //   } else {
  //     document.getElementsByClassName("commonThemeClass")[0].style.display = "none";
  //   }
  // };


  const [open, setOpen] = useState(false);

  const ref = useRef();

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (!ref.current.contains(event.target)) {
  //       setOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  // }, [ref]);



  return (
    <Fragment>
     <Row className="mt-4 mb-2">
        {isGlobalSearch && (
          <div className="col-sm-1 sel_con">

            <select
              className="form-select"
              value={pageSize}
              onChange={onChangeInSelect}
              style={{ width: "75px" }}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            isProductsFilter={isProductsFilter}
            isCustomerFilter={isCustomerFilter}
            isStatusFilter={isStatusFilter}
            isReportIndentFilter={isReportIndentFilter}
            isReportScheduledFilter={isReportScheduledFilter}
            isOrderFilter={isOrderFilter}
            isContactsFilter={isContactsFilter}
            isCompaniesFilter={isCompaniesFilter}
            isLeadsFilter={isLeadsFilter}
            isCryptoOrdersFilter={isCryptoOrdersFilter}
            isInvoiceListFilter={isInvoiceListFilter}
            isTicketsListFilter={isTicketsListFilter}
            isNFTRankingFilter={isNFTRankingFilter}
            isTaskListFilter={isTaskListFilter}
            SearchPlaceholder={SearchPlaceholder}
          />
        )}
        {isAddOptions && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
        {isAddUserList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}

          {/* {
            window.location.pathname === "/sequencing-IB" || window.location.pathname === "/sequencing-OB" ? '' :
              <section ref={ref}>
                <div >
                  <Nav className="nav-tabs nav-tabs-custom nav-success tog_con" role="tablist" style={{ border: "solid 1px lightgray", borderRadius: "4px", position: "absolute", top: "-47px", right: "20px" }}>

                    <NavItem>
                      <NavLink><span className="buttonForToggle text-end" onClick={() => setOpen(!open)}><i className="ri-menu-2-line" /></span></NavLink>
                    </NavItem>
                  </Nav>
                </div>
                {open && (
                  <div className="commonThemeClass" style={{ right: "20px", left: "unset", top: "0px", borderRadius: "5px" }}>
                    <span className="form-check form-switch form-switch-success mb-3">
                      <input className="form-check-input" type="checkbox" role="switch" id="SwitchCheck3" {...getToggleHideAllColumnsProps()} />Toggle All
                    </span>
                    {
                      allColumns.filter((col) => !col.disableHiding)
                        .map(column => (
                          (column.Header !== "" ?
                            <span key={column.id} className="form-check form-switch form-switch-success mb-3">
                              <input className="form-check-input" type="checkbox" role="switch" id="SwitchCheck3" {...column.getToggleHiddenProps()} />
                              {column.Header}
                            </span> : "")
                        ))

                    }
                  </div>
                )}
              </section>
          } */}

        {/* <div >
              <Button color="warning" className="btn-icon" outline onClick={() => { ActiveDeactiveTab(); }}> <i className="ri-menu-2-line" /> </Button>
            </div> */}
      </Row>
      {/*
      <div class="MuiPaper-root MuiMenu-paper MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation8 MuiPopover-paper css-15lbk41" tabindex="-1">
        <ul class="MuiList-root MuiList-padding MuiMenu-list css-r8u8y9" role="menu" tabindex="-1">
            <div class="MuiBox-root css-1crctjg" tabindex="0"><button class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium css-6txy7e" tabindex="0" type="button">Hide all<span class="MuiTouchRipple-root css-w0pj6f"></span></button><button class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium Mui-disabled MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium css-6txy7e" tabindex="-1" type="button" disabled="">Show all</button></div>
            <hr class="MuiDivider-root MuiDivider-fullWidth css-1px5dlw" />
            <li class="MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters MuiMenuItem-root MuiMenuItem-gutters css-10hh3hq" tabindex="-1" role="menuitem">
              <div class="MuiBox-root css-1pc03ml">
                <label class="MuiFormControlLabel-root Mui-disabled MuiFormControlLabel-labelPlacementEnd css-kswqkt">
                  <span class="MuiSwitch-root MuiSwitch-sizeMedium css-ecvcn9">
                    <span class="MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked Mui-disabled Mui-disabled PrivateSwitchBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked Mui-disabled Mui-checked Mui-disabled css-1nobdqi" tabindex="-1" aria-disabled="true" aria-label="Toggle visibility">
                      <input class="PrivateSwitchBase-input MuiSwitch-input css-1m9pwf3" disabled="" type="checkbox" checked=""/>
                      <span class="MuiSwitch-thumb css-19gndve">
                        </span>
                    </span>
                    <span class="MuiSwitch-track css-g5sy4h"></span>
                  </span><span class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label Mui-disabled css-1ev73gi">First Name</span></label></div>
            </li>
            <li class="MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters MuiMenuItem-root MuiMenuItem-gutters css-10hh3hq" tabindex="-1" role="menuitem">
              <div class="MuiBox-root css-1pc03ml"><label class="MuiFormControlLabel-root Mui-disabled MuiFormControlLabel-labelPlacementEnd css-kswqkt"><span class="MuiSwitch-root MuiSwitch-sizeMedium css-ecvcn9"><span class="MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked Mui-disabled Mui-disabled PrivateSwitchBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked Mui-disabled Mui-checked Mui-disabled css-1nobdqi" tabindex="-1" aria-disabled="true" aria-label="Toggle visibility"><input class="PrivateSwitchBase-input MuiSwitch-input css-1m9pwf3" disabled="" type="checkbox" checked=""/><span class="MuiSwitch-thumb css-19gndve"></span></span><span class="MuiSwitch-track css-g5sy4h"></span></span><span class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label Mui-disabled css-1ev73gi">Last Name</span></label></div>
            </li>
            <li class="MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters MuiMenuItem-root MuiMenuItem-gutters css-10hh3hq" tabindex="-1" role="menuitem">
              <div class="MuiBox-root css-1pc03ml"><label class="MuiFormControlLabel-root MuiFormControlLabel-labelPlacementEnd css-kswqkt"><span class="MuiSwitch-root MuiSwitch-sizeMedium css-ecvcn9"><span class="MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked PrivateSwitchBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked Mui-checked css-1nobdqi" aria-label="Toggle visibility"><input class="PrivateSwitchBase-input MuiSwitch-input css-1m9pwf3" type="checkbox" checked="" /><span class="MuiSwitch-thumb css-19gndve"></span><span class="MuiTouchRipple-root css-w0pj6f"></span></span><span class="MuiSwitch-track css-g5sy4h"></span></span><span class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-1ev73gi">Address</span></label></div>
            </li>
            <li class="MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters MuiMenuItem-root MuiMenuItem-gutters css-10hh3hq" tabindex="-1" role="menuitem">
              <div class="MuiBox-root css-1pc03ml"><label class="MuiFormControlLabel-root MuiFormControlLabel-labelPlacementEnd css-kswqkt"><span class="MuiSwitch-root MuiSwitch-sizeMedium css-ecvcn9"><span class="MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked PrivateSwitchBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked Mui-checked css-1nobdqi" aria-label="Toggle visibility"><input class="PrivateSwitchBase-input MuiSwitch-input css-1m9pwf3" type="checkbox" checked="" /><span class="MuiSwitch-thumb css-19gndve"></span><span class="MuiTouchRipple-root css-w0pj6f"></span></span><span class="MuiSwitch-track css-g5sy4h"></span></span><span class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-1ev73gi">City</span></label></div>
            </li>
            <li class="MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters MuiMenuItem-root MuiMenuItem-gutters css-10hh3hq" tabindex="-1" role="menuitem">
              <div class="MuiBox-root css-1pc03ml"><label class="MuiFormControlLabel-root MuiFormControlLabel-labelPlacementEnd css-kswqkt"><span class="MuiSwitch-root MuiSwitch-sizeMedium css-ecvcn9"><span class="MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked PrivateSwitchBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked Mui-checked css-1nobdqi" aria-label="Toggle visibility"><input class="PrivateSwitchBase-input MuiSwitch-input css-1m9pwf3" type="checkbox" checked="" /><span class="MuiSwitch-thumb css-19gndve"></span><span class="MuiTouchRipple-root css-w0pj6f"></span></span><span class="MuiSwitch-track css-g5sy4h"></span></span><span class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-1ev73gi">State</span></label></div>
            </li>
        </ul>
      </div>
      */}


      <div className={`${divClass} res_tab_con`} >

        <Table hover {...getTableProps()} className={tableClass}>
          <thead className={theadClass}>
            {headerGroups.map((headerGroup) => (
              <tr className={trClass} key={headerGroup.id}  {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} className={thClass} {...column.getSortByToggleProps()}>
                    {column.render("Header")}
                    {generateSortingIndicator(column)}
                    {/* <Filter column={column} /> */}
                  </th>
                ))}
              </tr>
            ))}

          </thead>

          <tbody {...getTableBodyProps()}>
            {(
              page.length > 0 && page.map(row => {
                prepareRow(row);
                //console.log("fetch-row", trClass);
                return (
                  <Fragment key={row.getRowProps().key}>
                    
                    <tr /*style={{background : row.original.queueType !== undefined ? (row.original.queueType === "WQ" ? "lightyellow" : "lightgreen") : "" }} */ >
                        {row.cells.map((cell) => {
                          return (
                            <td key={cell.id} {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                  {row.isExpanded && (
                      <tr>
                        <td colSpan={columns.length}>
                          <div className="bg-light p-2">
                            {/* Replace with desired expanded content */}
                            {/* <strong>Details:</strong> {row.values.name} */}
                            <Row>
                              {row.original.vehicles.map((Item, index) => (
                                <Col lg={3} key={index}>
                                  <div>
                                    <Card className="mb-1 ribbon-box ribbon-fill ribbon-sm shadow_light">
                                      <div className={`ribbon ribbon-info element`}> <i className="ri-truck-line" ></i> </div>
                                      <CardBody style={{ padding: "10px 0px 5px 0", textAlign: "center" }}>
                                        <div className="flex-grow-1 ms-3">
                                          <h6 className="fs-12 mb-1">{Item.registrationNumber} | {Item.vehicleCapacityMax}MT</h6>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  </div>
                                </Col>
                              ))}
 
 
                            </Row>
 
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              }
              )) || <tr><td style={{ textAlign: "center" }} colSpan={12}>No data found!</td></tr>}

          </tbody>
        </Table>
      </div>

      {
        window.location.pathname === "/sequencing-IB" || window.location.pathname === "/sequencing-OB" ? '' : <Row className="justify-content-md-end justify-content-center align-items-center p-2 pagina_con">
          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              Total Results : {data.length}
            </div>
          </Col>
          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={previousPage}
                disabled={!canPreviousPage}
              >
                {"<"}
              </Button>
            </div>
          </Col>
          <Col className="col-md-auto d-none d-md-block">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </Col>
          <Col className="col-md-auto">
            <Input
              type="number"
              min={1}
              style={{ width: 70 }}
              max={pageOptions.length}
              defaultValue={pageIndex + 1}
              onChange={onChangeInInput}
            />
          </Col>

          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
                {">"}
              </Button>
            </div>
          </Col>
        </Row>


      }

    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;

