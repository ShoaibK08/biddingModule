import React, { useRef, useState } from 'react';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

//SimpleBar
import SimpleBar from "simplebar-react";

//import images
import image1 from "../../assets/images/products/img-1.png";
import image2 from "../../assets/images/products/img-2.png";
import image3 from "../../assets/images/products/img-3.png";
import image6 from "../../assets/images/products/img-6.png";
import image5 from "../../assets/images/products/img-5.png";

const MyCartDropdown = () => {
    const cardItemTotal = useRef(null);

    const cartData = [
        { id: 1, img: image1, product: "Branded T-Shirts", quantity: 10, price: 32 },

    ];

    const [isCartDropdown, setIsCartDropdown] = useState(false);

    const [cartItem, setCartItem] = useState(cartData.length);

    const toggleCartDropdown = () => {
        setIsCartDropdown(!isCartDropdown);
        setCartItem(cartData.length);
    };

    const removeItem = (ele) => {
        var price = ele.closest(".dropdown-item-cart").querySelector('.cart-item-price').innerHTML;
        console.log("cardItemTotal", cardItemTotal)
        var subTotal = cardItemTotal.current.innerHTML;
        cardItemTotal.current.innerHTML = subTotal - price;

        ele.closest(".dropdown-item-cart").remove();
        const element = document.querySelectorAll(".dropdown-item-cart").length;
        const ecart = document.getElementById("empty-cart");

        if (element === 0) {
            ecart.style.display = 'block';
        } else {
            ecart.style.display = 'none';
        }

        setCartItem(element);
    };

    return (
        <React.Fragment>


            <div className="ms-1 header-item d-none d-sm-flex" style={{margin:'2px 8px 0 0'}}>
                <Link to="/apps-ecommerce-cart">
                    <i className='bx bx-shopping-bag fs-22' ></i>
                    <span className="position-absolute cartitem-badge topbar-badge fs-10 translate-middle badge rounded-pill bg-info" style={{margin:'-5px -10px 0 0 '}}>{cartItem}</span>
                </Link>
            </div>

        </React.Fragment>
    );
};

export default MyCartDropdown;