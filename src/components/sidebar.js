import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import logoImage from "../logo/logo.png";
import profileImg from "../logo/profile.jpg";
import config from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faCashRegister,
  faPlus,
  faBoxes,
  faFileMedical,
  faStore,
  faMoneyBillTransfer,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
// import StockDetailsPage from "./stock";
// import AddMedicine from "./addmedicine";
import Billing from "./billing";
// import ConsultationForm from "./consultationform";
// import Purchase from "./purchase";
// import BillingHis from "./billinghistory";
// import RegistrationForm from "./registration";
// import StockDetailsPage1 from "./pharmacystock";
import { BiChevronUp, BiChevronDown } from "react-icons/bi";
import "bootstrap/dist/css/bootstrap.min.css";

import CheckboxApp from "./patientregistration";
import { Fade } from "react-bootstrap";

const UserProfile = ({ user, onLogout }) => {
  const history = useHistory();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

   const handleLogout = async () => {
    const logoutEventData = {
      userId: user.user.user_id,
      userFirstName: user.user.user_first_name,
      userLastName: user.user.user_last_name,
      userRole: user.user.user_role,
    };
    setIsButtonDisabled(true); 
    try {
      const response = await fetch(`${config.apiUrl}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logoutEventData),
      });

      const result = await response.json();

      if (response.status === 200) {
        localStorage.removeItem("user");
        history.push("/");
        window.location.reload();
        setIsButtonDisabled(false); 
        onLogout();
      } else {
        console.error("Error logging logout event:", result.message);
      }
    } catch (error) {
      console.error("Error logging logout event:", error.message);
    }
  };

  return (
    <div className="flex-grow-0 font-serif">
    <div className="flex items-center">
      <div className="leading-5">
        <h6 className="font-bold">
          <p>{user ? ` ${user.user.user_role}` : "Guest"}</p>
        </h6>
        <p>{` ${user.user.user_first_name} ${user.user.user_last_name} `}</p>
      </div>
      <img
        src={profileImg}
        alt="Profile"
        className="w-14 h-14 mr-4 rounded-full "
      />
      <div className="mt-2">
        <button
          className="bg-transparent border-none focus:outline-none"
          onClick={handleLogout}
          disabled={isButtonDisabled}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </div>
  </div>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [showStockDetails, setShowStockDetails] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showPatientRegistration, setShowPatientRegistration] = useState(true);
  const history = useHistory();
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    activateMenu(menuName);
  };

  const activateMenu = (menuName) => {
    const menuItems = document.querySelectorAll('.sidebar ul li ');
    menuItems.forEach((menuItem) => {
      menuItem.classList.remove('active');
    });

    const activatedMenu = document.querySelector(`.sidebar ul li [data-menu="${menuName}"]`);
    if (activatedMenu) {
      activatedMenu.closest('li').classList.add('active');
    }
  };

 

  const handlePatientRegisterToggle = () => {
    if (
      user.user.user_role === "Doctor"
    ) {
        setShowPatientRegistration(true);   
        setShowBilling(false);   
    }
  };



  const handleBillingToggle = () => {
    if (
      (user && user.user.user_role === "Pharmacist") ||
      user.user.user_role === "Doctor"
    ) {
      setShowBilling(true);
     setShowPatientRegistration(false);
    }
  };
 
 
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setShowPatientRegistration(true);
        // setShowBilling(true);
        setActiveMenu('registration');
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/");
    window.location.reload();
  };
  return (


    <div className="bg-white"
      style={{fontFamily: "serif, sans-serif" }}
    >
      
      <style>
        {
          `
        .sidebar ul li {
            padding:5px;
            border-radius: 5px;
            width:100%;
            transition: background-color 0.3s;
        }

        .sidebar ul li:hover{
            background-color: #ebe6e6;
        }

        .sidebar ul li:active,
        .sidebar ul li.active {
          
          background-color: rgb(35, 63, 147);
          color: white;
        } 
    `
        }
      </style> 
   <div className="d-flex justify-content-between align-items-center bg-white border border-b ">
  <div className="d-flex align-items-center ">
    <img
      src={logoImage}
      alt="Profile"
      style={{
        width: "70px",
        height: "60px",
        // borderRadius: "50%",
        marginRight: "5px",
      }}
    />
    <div>
    <h1
  className="font-bold text-3xl"
  style={{
    color: 'rgb(35, 63, 147)' 
    // color: 'rgb(156,204,63)'
  }}
>
  New Project
</h1>

     
    </div>
  </div>

  <div style={{marginRight:'20px'}}>
    {user && <UserProfile user={user} onLogout={handleLogout} />}
  </div>
</div>
  
      <div className="row bg-white col-lg-12">
        <div className="col-lg-3 col-md-4">
          <div className="shadow-sm p-3  h-100 bg-white rounded">
           

            <div className="col-12 ">
              <button
                className="btn text-dark w-100 mb-3 text "
                style={{
                  background: 'rgb(35, 63, 147)',
                  // background: 'rgb(156,204,63)'
                }}
                
                onClick={handleToggle}
                type="button"
                aria-expanded={isOpen}
              >
                <b style={{ color: "white" }}>MENU</b>{" "}
                {/* {isOpen ? <BiChevronUp /> : <BiChevronDown />} */}
              </button>
              {/* <div className={`collapse${isOpen ? " show" : ""} `}> */}
              <div >
                <div className="d-flex justify-content-center font-size-14 sidebar">
                  <ul
                    className=" container-fluid  list-unstyled  mb-3"
                    style={{ lineHeight: "25px" }}
                  >
 {user &&
                      (user.user.user_role === "Doctor") && (
                        <li className={activeMenu === 'registration' ? 'active' : ''}
                        onClick={() => {
                         handlePatientRegisterToggle();
                          handleMenuClick('registration')
                        }}>
                          <a
                            href="#"
                            // className="text-decoration-none text-dark"
                           
                            data-menu="registration"

                          >
                            <FontAwesomeIcon
                              icon={faCashRegister}
                              className="me-3"
                            />
                            <b>Registration Form</b>
                          </a>
                        </li>
                      )}

                    {user &&
                      (user.user.user_role === "Pharmacist" ||
                        user.user.user_role === "Doctor") && (
                        <li className={activeMenu === 'billing' ? 'active' : ''}
                        onClick={() => {
                          handleBillingToggle();
                          handleMenuClick('billing')
                        }}>
                          <a
                            href="#"
                           
                            data-menu="billing"

                          >
                            <FontAwesomeIcon
                              icon={faCashRegister}
                              className="me-3"
                            />
                            <b>Consultation Doctor</b>
                          </a>
                        </li>
                      )}

                    {/* {user && user.user.user_role === "Pharmacist" && (
                      <li className={activeMenu === 'stockDetails' ? 'active' : ''}
                      onClick={() => {
                        handleStockDetailsToggle1();
                        handleMenuClick('stockDetails')
                      }}>
                        <a
                          href="#"
                          className="text-decoration-none text-dark"
                          data-menu="stockDetails"
                        >
                          <FontAwesomeIcon icon={faBoxes} className="me-3" />{" "}
                          <b>Stock Details</b>
                        </a>
                      </li>
                    )} */}

                    <br />
{/* 
                    {user && user.user.user_role === "Doctor" && (
                      <li className={activeMenu === 'addmedicine' ? 'active' : ''}
                      onClick={() => {
                        handleAddMedicineToggle();
                        handleMenuClick('addmedicine')
                      }}>
                        <a
                          href="#"
                          className="text-decoration-none text-dark"
                          
                          data-menu="addmedicine"
                        >
                          <FontAwesomeIcon icon={faPlus} className="me-3" />
                          <b>Add Medicine</b>
                        </a>
                      </li>
                    )}

                    <br />

                    {user && user.user.user_role === "Doctor" && (
                      <li className={activeMenu === 'consultation' ? 'active' : ''}
                      onClick={() => {
                        handleFormToggle();
                        handleMenuClick('consultation')
                      }}>
                        <a
                          href="#"
                          className="text-decoration-none text-dark"
                          data-menu="consultation"

                        >
                          <FontAwesomeIcon
                            icon={faFileMedical}
                            className="me-3"
                          />
                          <b>Consultation Form</b>
                        </a>
                      </li>
                    )}

                    <br />

                    {user && user.user.user_role === "Doctor" && (
                      <li className={activeMenu === 'StockDetails' ? 'active' : ''}
                      onClick={() => {
                        handleStockDetailsToggle();
                        handleMenuClick('StockDetails')
                      }}>
                        <a
                          href="#"
                          className="text-decoration-none text-dark"
                        
                          data-menu="StockDetails"
                        >
                          <FontAwesomeIcon icon={faBoxes} className="me-3" />
                          <b>Stock Details</b>
                        </a>
                      </li>
                    )}
                    <br />
                    {user && user.user.user_role === "Doctor" && (
                      <li className={activeMenu === 'purchase' ? 'active' : ''}
                      onClick={() => {
                        handlePurchaseToggle();
                        handleMenuClick('purchase')
                      }}>
                        <a
                          href="#"
                          className="text-decoration-none text-dark"
                         
                          data-menu="purchase"
                        >
                          <FontAwesomeIcon icon={faStore} className="me-3" />
                          <b>Purchase History</b>
                        </a>
                      </li>
                    )}
                    <br /> */}

                    {/* {user && user.user.user_role === "Doctor" && (
                      <li className={activeMenu === 'billingHistory' ? 'active' : ''}
                      onClick={() => {
                        handleBillingHisToggle();
                        handleMenuClick('billingHistory')
                      }}>
                                              <a
                        href="#"
                        className="text-decoration-none text-dark"
                       
                        data-menu="billingHistory"

                      >
                        <FontAwesomeIcon
                          icon={faMoneyBillTransfer}
                          className="me-3"
                        />
                        <b>Billing History</b>
                      </a>
                      </li>
                    )} */}
                    {/* <br />
                    {user && user.user.user_role === "Doctor" && (
                      <li className={activeMenu === 'registration' ? 'active' : ''}
                      onClick={() => {
                        handleRegistrationFormToggle();
                        handleMenuClick('registration')
                      }}>
                        <a
                          href="#"
                          className="text-decoration-none text-dark"
                         
                          data-menu="registration"

                        >
                          <FontAwesomeIcon icon={faIdCard} className="me-3" />
                          <b>Registration Form</b>
                        </a>
                      </li>
                    )} */}
                  </ul>
                </div>               
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>

        <div className="col-lg-9 col-md-8 "
        >
          <div className="row " style={{overflow:'auto'}} >
            <div className="col">
             

              <div
                className="billing-content"
                style={{
                  display: showBilling ? "block" : "none",
                  marginLeft: "0px",
                }}
              >
                {showBilling && (
                  <div className="billing-content"
                  style={{ overflowX: "auto" }}>
                    <Billing />
                  </div>
                )}
              </div>

           

              <div
                className="registration-form-content"
                style={{ display: showPatientRegistration ? "block" : "none" }}
              >
                {showPatientRegistration && (
                  <div className="registration-form-content">
                    <CheckboxApp />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;