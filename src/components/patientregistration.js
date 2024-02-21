import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";
import config from "../config";
import _ from "lodash";
import profile from "../../src/logo/pr.jpg";
import logo from "../../src/logo/logo1.png";
import { useReactToPrint } from "react-to-print";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

const LoadingSpinner = () => (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex items-center bg-blue-500 p-2 rounded-lg shadow-lg">
    <div className="animate-spin rounded-full border-t-4 bg-violet-950 border-opacity-50 h-8 w-8 mx-2"></div>
    <div className="text-white font-bold">Loading...</div>
  </div>
);

const CheckboxApp = ({ uhid }) => {
  const componentRef = useRef();
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [ageUnit, setAgeUnit] = useState("years");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [cityVillage, setCityVillage] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("Tamil Nadu");
  const [district, setDistrict] = useState("");
  const [registrationDate, setRegistrationDate] = useState(getCurrentDate());

  const [uhidInput, setUhidInput] = useState("");
  const [mobileNumberInput, setMobileNumberInput] = useState("");

  const [submittedData, setSubmittedData] = useState(null);
  const [editupdate, setEditUpdate] = useState(null);

  const [isFirstTimeRegistration, setIsFirstTimeRegistration] = useState(true);
  const [editedData, setEditedData] = useState({});

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showRedBorders, setShowRedBorders] = useState(false);
  const [showRedBorders1, setShowRedBorders1] = useState(false);


  const [showSubmit, setShowSubmit] = useState(true);
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] =
    useState(false);

  const [isallare, setIsAllAre] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isUpdating, setUpdating] = useState(false);

  const [idCardData, setIdCardData] = useState(null);
  const [showIdCard, setShowIdCard] = useState(false);
  const printRef = useRef();
  const [patientData, setPatientData] = useState({});
  const [showPatientsTable, setShowPatientsTable] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showInputs, setShowInputs] = useState(false);
  const [multiplePatients, setMultiplePatients] = useState(null);
  const[tablehide,setTablehide]=useState(false);
  const [selectedPatientUHID, setSelectedPatientUHID] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [patientHistory, setPatientHistory] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  const allDistricts = {
    "Tamil Nadu": [
      "Ariyalur",
      "Chengalpattu",
      "Chennai",
      "Coimbatore",
      "Cuddalore",
      "Dharmapuri",
      "Dindigul",
      "Erode",
      "Kallakurichi",
      "Kanchipuram",
      "Kanyakumari",
      "Karur",
      "Krishnagiri",
      "Madurai",
      "Mayiladuthurai",
      "Nagapattinam",
      "Namakkal",
      "Nilgiris",
      "Perambalur",
      "Pudukkottai",
      "Ramanathapuram",
      "Ranipet",
      "Salem",
      "Sivaganga",
      "Tenkasi",
      "Thanjavur",
      "Theni",
      "Thoothukudi",
      "Tiruchirappalli",
      "Tirunelveli",
      "Tirupathur",
      "Tiruppur",
      "Tiruvallur",
      "Tiruvannamalai",
      "Vellore",
      "Viluppuram",
      "Virudhunagar",
    ],

  };

  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const currentDate = new Date();

      switch (ageUnit) {
        case "days":
          const ageDifferenceInDays = Math.floor(
            (currentDate - birthDate) / (1000 * 60 * 60 * 24)
          );
          setAge(ageDifferenceInDays);
          break;
        case "months":
          const ageDifferenceInMonths =
            currentDate.getMonth() -
            birthDate.getMonth() +
            12 * (currentDate.getFullYear() - birthDate.getFullYear());
          setAge(ageDifferenceInMonths);
          break;
        case "years":
        default:
          const ageDifferenceInYears =
            currentDate.getFullYear() - birthDate.getFullYear();
          setAge(ageDifferenceInYears);
          break;
      }
    }
  }, [dob, ageUnit]);
  useEffect(() => {
    const delay = 1000; // Adjust the delay according to your preferences

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`${config.apiUrl}/registration/patient/namesearch?name=${searchTerm}`);
        if (response.ok) {
          const searchResults = await response.json();
          setSearchResults(searchResults);
        } else {
          console.error('Failed to fetch search results');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }, delay);

    // Clear the previous timeout to prevent multiple API calls
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);


  useEffect(() => {
    const currentDate = getCurrentDate();
    setRegistrationDate(currentDate);
  }, []);
  const fetchPatientHistory = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/registration/patient/all`);
      if (!response.ok) {
        throw new Error('Error fetching patient history');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching patient history:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  };

  const openHistory = async () => {
    try {
      const data = await fetchPatientHistory();
      setPatientHistory(data);
      setShowHistory(true);
    } catch (error) {
     
      console.error('Failed to fetch patient history:', error);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;

    if (isFirstTimeRegistration) {
      setTitle(newTitle);
    } else {
      setEditedData({ title: newTitle });
    }
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value.replace(/[^A-Za-z ]/g, ""));
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value.replace(/[^A-Za-z ]/g, ""));
  };

  const handleFatherNameChange = (event) => {
    setFatherName(event.target.value.replace(/[^A-Za-z ]/g, "").trim());
  };

  const handleDobChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
  
    // Check if the selected date is beyond the current date
    if (selectedDate > currentDate) {
      // If it is, set the date to the current date
      setDob('');
      setAgeUnit('years')
      setAge(0);
    } else {
      setDob(event.target.value);
  
      // Calculate age based on the selected date
      const ageDifferenceInDays = Math.floor((currentDate - selectedDate) / (1000 * 60 * 60 * 24));
      const ageDifferenceInMonths = (currentDate.getMonth() - selectedDate.getMonth()) +
        12 * (currentDate.getFullYear() - selectedDate.getFullYear());
      const ageDifferenceInYears = currentDate.getFullYear() - selectedDate.getFullYear();
  
      // Automatically set the appropriate age unit
      if (ageDifferenceInDays < 30) {
        setAgeUnit("days");
        setAge(ageDifferenceInDays);
      } else if (ageDifferenceInMonths < 12) {
        setAgeUnit("months");
        setAge(ageDifferenceInMonths);
      } else {
        setAgeUnit("years");
        setAge(ageDifferenceInYears);
      }
    }
  };

  const handleStreet1Change = (event) => {
    setStreet1(event.target.value);
  };

  const handleStreet2Change = (event) => {
    const value = event.target.value.replace(/[^A-Za-z ]/g, "");
    setStreet2(value);
  };

  const handleCityVillageChange = (event) => {
    setCityVillage(event.target.value);
  };

  const handleAgeChange = (event) => {
    const inputAge = parseInt(event.target.value, 10);

    if (!isNaN(inputAge) && inputAge >= 0) {
      setAge(inputAge);
    } else {
      setAge(0);
    }
  };

  const handleAgeUnitChange = (event) => {
    const selectedAgeUnit = event.target.value;
    setAgeUnit(selectedAgeUnit);

  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
  };
  const districtsOptions = allDistricts[state] || [];

  const handleStateChange = (event) => {
    setState(event.target.value);
    setDistrict("");
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const displayAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 2000);
  };

  const resetFormFields = () => {
    setUhidInput("");
    setMobileNumberInput("");
    setTitle("");
    setFirstName("");
    setLastName("");
    setFatherName("");
    setDob("");
    setAge("");
    setAgeUnit("years");
    setGender("");
    setStreet1("");
    setStreet2("");
    setCityVillage("");
    setMobileNumber("");
    setDistrict("");
    setState("Tamil Nadu");
    setCountry("India");
    setAadhaarNumber("");
    setIsAllAre(false);
    setShowUpdateSuccessMessage(false);
  };
  const handleClose = () => {
    setShowIdCard(false);
  };


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "ID Card",
  });
  
  
  

  const handleSubmit = () => {
    if (
      !title ||
      !firstName.trim() ||
      !lastName.trim() ||
      !fatherName.trim() ||
      !age ||
      !gender ||
      !aadhaarNumber ||
      !street1.trim() ||
      !street2.trim() ||
      !cityVillage.trim() ||
      !district.trim() ||
      !state.trim() ||
      !country.trim() ||
      !mobileNumber.trim()
    ) {
      setShowRedBorders(true);

      setTimeout(() => {
        setShowRedBorders(false);
      }, 2000);

      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setShowAlert(true);
      setAlertMessage("Please enter a valid mobileNumber");

      setTimeout(() => {
        setShowAlert(false);
        setSubmitDisabled(false);
      }, 2000);

      return;
    }

    if (aadhaarNumber.length !== 12) {
      setAlertMessage("Aadhar number must be 12 digits");
      setShowRedBorders(true);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        setShowRedBorders(false);
        setSubmitDisabled(false);
      }, 2000);

      return;
    }

    setSubmitDisabled(true);

    const formData = {
      Title: title,
      first_Name: firstName,
      last_Name: lastName,
      father_name: fatherName,
      date_of_birth: dob || null,
      age: age,
      age_Unit: ageUnit,
      gender: gender,
      Mobile_number: mobileNumber,
      aadhar_number: aadhaarNumber,
      street1: street1,
      street2: street2,
      city_village: cityVillage,
      district: district,
      state: state,
      country: country,
      registration_date: registrationDate,
    };

    fetch(`${config.apiUrl}/registration/patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        console.log(response); 
        if (response.status === 400) {
          throw new Error('Aadhar number already exists');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }
      return response.json();
    })
      .then((data) => {
        const { uhid } = data;

        if (uhid) {
          const receivedUHID = uhid;
          console.log("id", receivedUHID);

          const idCard = {
            uhid: receivedUHID,
            name: `${title} ${firstName} ${lastName}`,
            age: `${age} ${ageUnit}`,
            district: `${district}`,
            mobileNumber: `${mobileNumber}`,
          };

          setIdCardData(idCard);
          console.log("id card", idCard);

          const submittedData = {
            uhid: uhid,
            dateTime: new Date().toLocaleString(),
            ...formData,
          };

          setSubmittedData(submittedData);
          setSubmitting(true);
          setTimeout(() => {
            setShowSuccessMessage(true);
          }, 2000);

          setTimeout(() => {
            resetFormFields();
            setSubmitDisabled(false);
            setShowSuccessMessage(false);
            setSubmitting(false);
            setShowIdCard(true);
          }, 4000);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        if (error instanceof Error) {
          if (error.response && error.response.status === 400) {
            setAlertMessage('Aadhar number already exists');
          } else {
            console.error('Server response:', error.message);
            setAlertMessage(error.message);
          }
          setShowAlert(true);
        } else {
          setAlertMessage('Unknown error occurred');
          setShowAlert(true);
        }
        setSubmitDisabled(true);
        setTimeout(() => {
          setSubmitDisabled(false);
          setShowAlert(false);
        }, 2000);
      });
      
  };

  const handleSaveChanges = async () => {
    try {
      if (
        !title ||
        !firstName.trim() ||
        !lastName.trim() ||
        !fatherName.trim() ||
        !age ||
        !gender ||
        !aadhaarNumber ||
        !street1.trim() ||
        !street2.trim() ||
        !cityVillage.trim() ||
        !district.trim() ||
        !state.trim() ||
        !country.trim() ||
        !mobileNumber.trim()
      ) {
        setShowRedBorders(true);

        setTimeout(() => {
          setShowRedBorders(false);
        }, 2000);

        return;
      }

      setSubmitDisabled(true);

      if (!uhidInput && !mobileNumberInput) {
        setShowRedBorders1(true)

        setTimeout(() => {
          // setShowAlert(false);
          // setAlertMessage('');
          setShowRedBorders1(false);
          setSubmitDisabled(false);
        }, 2000);
        return;
      }

      if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
        setShowAlert(true);
        setAlertMessage("Please enter a valid mobileNumber");

        setTimeout(() => {
          setShowAlert(false);
          setSubmitDisabled(false);
        }, 2000);

        return;
      }

    

      const isDataChanged =
  title !== patientData.Title ||
  firstName !== patientData.first_Name ||
  lastName !== patientData.last_Name ||
  fatherName !== patientData.father_name ||
  dob !==
    (patientData.date_of_birth
      ? format(new Date(patientData.date_of_birth), "yyyy-MM-dd")
      : null) ||
  age !== patientData.age ||
  ageUnit !== patientData.age_Unit ||
  gender !== patientData.gender ||
  mobileNumber !== patientData.Mobile_number ||
  street1 !== patientData.street1 ||
  street2 !== patientData.street2 ||
  cityVillage !== patientData.city_village ||
  district !== patientData.district ||
  state !== patientData.state ||
  country !== patientData.country ||
  registrationDate !==
    (patientData.registration_date
      ? format(new Date(patientData.registration_date), "yyyy-MM-dd")
      : "");


   
      const identifier = selectedPatient.uhid
      console.log(identifier);
      const updatedData = {
        Title: title || (selectedPatient && selectedPatient.Title) || '',
        first_Name: firstName || (selectedPatient && selectedPatient.first_Name) || '',
        last_Name: lastName || (selectedPatient && selectedPatient.last_Name) || '',
        father_name: fatherName || (selectedPatient && selectedPatient.father_name) || '',
        date_of_birth: dob || (selectedPatient && selectedPatient.date_of_birth) || null,
        age: age || (selectedPatient && selectedPatient.age) || '',
        age_Unit: ageUnit || (selectedPatient && selectedPatient.age_Unit) || '',
        gender: gender || (selectedPatient && selectedPatient.gender) || '',
        Mobile_number: mobileNumber || (selectedPatient && selectedPatient.Mobile_number) || '',
        street1: street1 || (selectedPatient && selectedPatient.street1) || '',
        street2: street2 || (selectedPatient && selectedPatient.street2) || '',
        city_village: cityVillage || (selectedPatient && selectedPatient.city_village) || '',
        district: district || (selectedPatient && selectedPatient.district) || '',
        state: state || (selectedPatient && selectedPatient.state) || '',
        country: country || (selectedPatient && selectedPatient.country) || '',
      };
      
  console.log(updatedData);

      if (isDataChanged) {
        const response = await fetch(
          `${config.apiUrl}/registration/patient/${identifier}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error("Failed to update patient data:", errorMessage);
          throw new Error("Failed to update patient data");
        }

        setUpdating(true);

        setTimeout(() => {
          setShowUpdateSuccessMessage(true);
        }, 2000);

        setTimeout(() => {
          resetFormFields();
          setSubmitDisabled(false);
          setShowUpdateSuccessMessage(false);
          setShowSubmit(true);
          setUpdating(false);
        }, 4000);
        setShowInputs(!showInputs)
      } else {
        console.log("Values are equal. Update not allowed.");
        setShowAlert(true);
        setAlertMessage("No changes detected. Update not allowed.");
        setTimeout(() => {
          setShowAlert(false);
          setSubmitDisabled(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving changes:", error.message);
      setUpdating(false);

      setTimeout(() => {
        setSubmitDisabled(false);
      }, 2000);
    }
  };

  const handleSearchClick = async () => {
    
    
    try {
      const searchQuery = uhidInput || mobileNumberInput;

    if (!searchQuery) {
      // setShowAlert(true);
      // setAlertMessage('Please enter UHID or Mobile Number.');
      setShowRedBorders1(true)

      setTimeout(() => {
        // setShowAlert(false);
        // setAlertMessage('');
        setShowRedBorders1(false);
      }, 2000);

      return;
    }

      const response = await axios.get(
        `${config.apiUrl}/registration/patient/search`,
        {
          params: {
            uhidOrPhoneNumber: searchQuery,
          },
        }
      );

      const data = response.data;
      setEditUpdate(data);
      setPatientData(data);
      if (Array.isArray(data) && data.length > 1) {
        // Multiple patients found for the same mobile number
  
        // Set the list of patients with the same mobile number
        setMultiplePatients(data);
        setTablehide(false); // Show the table
        console.log('Multiple Patients:', data);
        return;
      }

     else if (data && data.uhid) {
        setIsAllAre(true);
        setSelectedPatient(data);
        const patientData = data;

        setTitle(patientData.Title || "");
        setFirstName(patientData.first_Name || "");
        setLastName(patientData.last_Name || "");
        setFatherName(patientData.father_name || "");

        const dateOfBirthString = patientData.date_of_birth;
        setDob(
          dateOfBirthString
            ? format(new Date(dateOfBirthString), "yyyy-MM-dd")
            : null
        );

        setAge(patientData.age || "");
        setAgeUnit(patientData.age_Unit || "");
        setGender(patientData.gender || "");
        setMobileNumber(patientData.Mobile_number || "");
        setAadhaarNumber(patientData.aadhar_number || "");
        setStreet1(patientData.street1 || "");
        setStreet2(patientData.street2 || "");
        setCityVillage(patientData.city_village || "");
        setDistrict(patientData.district || "");
        setState(patientData.state || "");
        setCountry(patientData.country || "");
        const registrationDateString = patientData.registration_date;
        setRegistrationDate(
          registrationDateString
            ? format(new Date(registrationDateString), "yyyy-MM-dd")
            : ""
        );

        setShowSubmit(false);
        setTablehide(true);

        setTimeout(() => {
          setShowAlert(false);
          setAlertMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("No patient data:", error);
      setShowAlert(true);
      setAlertMessage("Patient Data not Available.");

      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
      }, 2000);
    }
  };

  const handleMobileNumberChange = (event) => {
    const cleanedValue = event.target.value.replace(/\D/g, "");
    setMobileNumber(cleanedValue);
  };

  const handleAadhaarNumberChange = (event) => {
    const cleanedValue = event.target.value.replace(/\D/g, "");
    const truncatedValue = cleanedValue.substring(0, 12);
    setAadhaarNumber(truncatedValue);
  };

  const handleBButtonClick = () => {
    setUhidInput("");
    setMobileNumberInput("");
    resetFormFields();
    setShowSubmit(true);
    setSubmitDisabled(false);
  };
  const handleIconClick = () => {
    setShowInputs(!showInputs);
  };
  const handlePatientSelect = (selectedPatient) => {
    console.log('Selected Patient:', selectedPatient);
    setEditedData(selectedPatient);
    setSelectedPatient(selectedPatient);
  
    setSelectedPatientUHID(selectedPatient.uhid);
    setIsAllAre(true);
    setTablehide(true);
    
  
  
    setTitle(selectedPatient.Title || '');
    setFirstName(selectedPatient.first_Name || '');
    setLastName(selectedPatient.last_Name || '');
    setFatherName(selectedPatient.father_name || '');
  
    const dateOfBirthString = selectedPatient.date_of_birth;
    setDob(
      dateOfBirthString
        ? format(new Date(dateOfBirthString), 'yyyy-MM-dd')
        : null
    );
  
    setAge(selectedPatient.age || '');
    setAgeUnit(selectedPatient.age_Unit || '');
    setGender(selectedPatient.gender || '');
    setMobileNumber(selectedPatient.Mobile_number || '');
    setAadhaarNumber(selectedPatient.aadhar_number || '');
    setStreet1(selectedPatient.street1 || '');
    setStreet2(selectedPatient.street2 || '');
    setCityVillage(selectedPatient.city_village || '');
    setDistrict(selectedPatient.district || '');
    setState(selectedPatient.state || '');
    setCountry(selectedPatient.country || '');
  
    setShowSubmit(false);
  
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage('');
    }, 2000);
  };
  const handleSearchInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
  };
  

  
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredPatients([]);
  };
  return (
<>

{showHistory && (
      <div className="h-full border bg-gray-50 pl-10 pr-8  pt-6 pb-8">
        <input
        type="text"
        placeholder="Search by patient name"
        value={searchTerm}
        onChange={handleSearchInputChange}
        className="px-4 py-2 border mb-4  mr-3 float-right placeholder-gray-500"
      />

      {/* Clear search button */}
      {searchTerm && (
        <button className="px-4 py-2  float-right bg-cyan-700 text-white" onClick={clearSearch}>
          Clear
        </button>
      )}
        <button
     className="top-17 left-45 text-red-500 "
     onClick={() => setShowHistory(false)}
    >
     &#x2716; 
    </button>
         <h2 className="text-xl font-bold mb-2">Patient History</h2>
         
         <table className="table-auto w-full">
         <thead className="text-center bg-blue-900 text-white">
       <tr>
         <th className="px-4 py-2">UHID</th>
         <th className="px-4 py-2">Name</th>
         <th className="px-4 py-2">Father Name</th>
         <th className="px-4 py-2">Age</th>
         <th className="px-4 py-2">gender</th>
         <th className="px-4 py-2">Mobile Number</th>
         <th className="px-4 py-2">Aadhar number</th>
       </tr>
     </thead>
           <tbody>
           {(searchResults.length > 0 ? searchResults: patientHistory).map((patientData, index) => (
               <tr key={patientData.uhid} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
             
                 <td className="border px-4 py-2">{patientData.uhid}</td>
    
                 <td className="border px-4 py-2">{`${patientData.Title} ${patientData.first_Name} ${patientData.last_Name}`}</td>
           <td className="border px-4 py-2">{patientData.father_name}</td>
                
           <td className="border px-4 py-2">{patientData.age}</td>
           <td className="border px-4 py-2">{patientData.gender}</td>
              
                 <td className="border px-4 py-2">{patientData.Mobile_number}</td>
               
                 <td className="border px-4 py-2">{patientData.aadhar_number}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     )}


{!showHistory && (
    <div className="container m-2">
     

     
  <style>
        {`
          .print-container {
            text-align: center;
           
           
          }

          @media print {
            body {
              margin: 10px;
            }

            .print-container {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              text-align: center; 
              border: 2px solid black;
              width: 60%; 
              height: 40vh; 
              
              
            }
          }
        `}
      </style>

      <div className="flex md:items-center float-right p-2">
        <label className="mb-1 mr-2 label-width"> Date:</label>
        <input
          type="date"
          className="border border-gray-300 rounded-md p-2 fixed-size-input"
          value={registrationDate}
          readOnly
        />
      </div>
    
      
      <div className="h-full border bg-gray-50 pl-10 pr-8  pt-16 pb-20">
    
        <div>
        <div style={{display:'flex', justifyContent:'flex-start'}}>
          <h2 className="text-xl font-bold">Patient Details</h2>
          <div onClick={handleIconClick} className="ml-5 mt-1" title="Search Patient Details"  >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

      </div> 
      
      <div onClick={openHistory} className="ml-auto mt-1" title="Search Patient History"  >
      <FontAwesomeIcon icon={faHistory} />
      </div> 
      
        </div>


        <div>
        {showInputs && (
       <div>
       <div style={{ display: "inline-block", marginRight: "20px" }}>
          <label className="inline" style={{ marginRight: "8px" }}>
            UHID:
          </label>

          <input
            type="text"
            id="uhidInput"
            value={uhidInput}
            onChange={(e) => setUhidInput(e.target.value)}
            style={{
              backgroundColor: "white",
              border: showRedBorders1 && !uhidInput ? "1px solid red" : "1px solid #ccc",
              padding: "0.5rem",
              borderRadius: "0.25rem",
              width: "190px",
              height: "40px",
              marginLeft:"50px"
            }}
          />
        </div>

        <div style={{ display: "inline-block" }}>
          <label className="inline" style={{ marginRight: "8px" }}>
            Mobile No:
          </label>
          <input
            type="tel"
            pattern="[0-9]{10}"
            maxLength="10"
            value={mobileNumberInput}
            onChange={(e) => setMobileNumberInput(e.target.value)}
            // className="w-full border border-gray-500 md:w-48"
            style={{
              backgroundColor: "white",
              border: showRedBorders1 && !mobileNumberInput ? "1px solid red" : "1px solid #ccc",
              padding: "0.5rem",
              borderRadius: "0.25rem",
              width: "190px",
              height: "40px",
              marginLeft:"16px"
            }}
          />
        </div>

        <button
          onClick={handleSearchClick}
          className="bg-blue-500  text-white p-2 ml-8 rounded-md "
        >
          Search
        </button>
        <button
          onClick={handleBButtonClick}
          className="bg-green-500   text-white p-2  ml-8 rounded-md  "
        >
          Clear
        </button>
       </div>
       )}
        </div>
        

          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4 mt-2">
            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className=" mb-1 mr-16 whitespace-nowrap label-width">
                Title <span className="mandatory-asterisk">*</span>
              </label>
              <select
                value={isFirstTimeRegistration ? title : editedData.title}
                onChange={handleTitleChange}
                style={{
                  backgroundColor: "white",
                  border: showRedBorders && !title ? "1px solid red" : "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  width: "189px",
                  height: "40px"
                }}
                
              >
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
                <option value="Baby">Baby</option>
                <option value="Baby boy of">Baby boy of</option>
                <option value="Baby girl of">Baby girl of</option>
              </select>
            </div>

            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-4 whitespace-nowrap label-width">
                First Name <span className="mandatory-asterisk">*</span>
              </label>
              <input
                type="text"
                value={
                  isFirstTimeRegistration ? firstName : editedData.firstName
                }
                onChange={handleFirstNameChange}
                style={{
                  backgroundColor: "white",
                  border: showRedBorders && !firstName ? "1px solid red" : "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  width: "190px",
                  height: "40px",
                 marginRight:"3px"
                }}
              />
            </div>

            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-3 whitespace-nowrap label-width">
                Last Name <span className="mandatory-asterisk">*</span>
              </label>
              <input
                type="text"
                value={isFirstTimeRegistration ? lastName : editedData.lastName}
                onChange={handleLastNameChange}
               
                style={{
                  backgroundColor: "white",
                  border: showRedBorders && !lastName ? "1px solid red" : "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  width: "190px",
                  height: "40px"
                }}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4 mt-2">
            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-2 whitespace-nowrap label-width">
                Father Name <span className="mandatory-asterisk">*</span>
              </label>
              <input
                type="text"
                value={
                  isFirstTimeRegistration ? fatherName : editedData.fatherName
                }
                style={{
                  backgroundColor: "white",
                  border: showRedBorders && !fatherName ? "1px solid red" : "1px solid #ccc",
                  padding: "0.4rem",
                  borderRadius: "0.25rem",
                  width: "189px",
                  height: "40px",
                  marginLeft:"2px"
                }}
                onChange={handleFatherNameChange}
               
              />
            </div>

            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-4 whitespace-nowrap label-width">
                Date of Birth
              </label>
              <input
                type="date"
                className="border border-gray-300 p-2 rounded-md  fixed-size-input"
                value={isFirstTimeRegistration ? dob : editedData.dob}
                onChange={handleDobChange}
                style={{width:"190px"}}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1  mr-14 whitespace-nowrap ">
                Age <span className="mandatory-asterisk">*</span>
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                
                  style={{
                    backgroundColor: "white",
                    border: showRedBorders && !age && !dob ? "1px solid red" : "1px solid #ccc",
                    padding: "0.5rem",
                    borderRadius: "0.25rem",
                    width: "103px",
                    height: "40px"
                  }}
                  value={isFirstTimeRegistration ? age : editedData.age}
                  onChange={handleAgeChange}
                  readOnly={!!dob} 
                />
                <select
                  className="border border-gray-300 rounded-md  p-2 text-sm "
                  value={isFirstTimeRegistration ? ageUnit : editedData.ageUnit}
                  onChange={handleAgeUnitChange}
                  style={{ backgroundColor: "white" }}
                  readOnly={!!dob} 
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4 mt-2">
            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-12 whitespace-nowrap label-width">
                Gender <span className="mandatory-asterisk">*</span>
              </label>
              <select
                // className={`h-7 border ${
                //   showRedBorders && !gender
                //     ? "border-red-500"
                //     : "border-gray-300"
                // } p-2 rounded-md input-field w-full fixed-size-input`}
                style={{
                  backgroundColor: "white",
                  border: showRedBorders && !gender ? "1px solid red" : "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  width: "188px",
                  height: "40px"
                }}
                value={isFirstTimeRegistration ? gender : editedData.gender}
                onChange={handleGenderChange}
                // style={{ backgroundColor: "white", width:'200px', height:'40px' }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="transgender">TransGender</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-2 whitespace-nowrap label-width">
                Mobile No <span className="mandatory-asterisk">*</span>
              </label>
              <input
                type="tel"
                pattern="[0-9]{10}"
                maxLength="10"
                style={{
                  backgroundColor: "white",
                  border: showRedBorders && !mobileNumber ? "1px solid red" : "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  width: "188px",
                  height: "40px",
                  marginLeft:"9px"
                }}
                value={
                  isFirstTimeRegistration
                    ? mobileNumber
                    : editedData.mobileNumber
                }
                onChange={handleMobileNumberChange}
              />
            </div>

            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
  <label className="mb-1 mr-10 label-width">
    Aadhaar No <span className="mandatory-asterisk">*</span>
  </label>
  {isallare ? (
    <input
      type="tel"
      pattern="[0-9]{10}"
      maxLength="10"
      style={{
        backgroundColor: "white",
        border: showRedBorders && !aadhaarNumber ? "1px solid red" : "1px solid #ccc",
        padding: "0.5rem",
        borderRadius: "0.25rem",
        width: "188px",
        height: "40px",
        marginLeft: "9px"
      }}
      value={isFirstTimeRegistration ? aadhaarNumber : editedData.aadhaarNumber}
      onChange={handleAadhaarNumberChange}
      readOnly
    />
  ) : (
    <input
      type="text"
      pattern="[0-9]{12}"
      maxLength="12"
      style={{
        backgroundColor: "white",
        border: showRedBorders && !aadhaarNumber ? "1px solid red" : "1px solid #ccc",
        padding: "0.5rem",
        borderRadius: "0.25rem",
        width: "188px",
        height: "40px",
        marginLeft: "9px"
      }}
      value={isFirstTimeRegistration ? aadhaarNumber : editedData.aadhaarNumber}
      onChange={handleAadhaarNumberChange}
    />
  )}
</div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mt-2 mb-4">Home Address</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4 mt-2">
            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-2 whitespace-nowrap label-width">
                Country <span className="mandatory-asterisk">*</span>
              </label>
              <input
    type="text"
    className="border border-gray-300 p-2  rounded-md "
    style={{
      width: "190px", 
      height: "40px",
      marginLeft:"30px" 
    }}
    value={country}
    onChange={handleCountryChange}
    readOnly
  />
            </div>

            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-2 whitespace-nowrap label-width">
                State <span className="mandatory-asterisk">*</span>
              </label>
              <input
    type="text"
    className="border border-gray-300 p-2 rounded-md "
    style={{
      width: "190px", 
      height: "40px",
      marginLeft:"15px" 
    }}
    value={state}
    onChange={handleStateChange}
    readOnly
  />
            </div>

            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-2 whitespace-nowrap label-width">
                District <span className="mandatory-asterisk">*</span>
              </label>
              <select
                // className={`border ${
                //   showRedBorders && !district
                //     ? "border-red-500"
                //     : "border-gray-300"
                // } p-2 rounded-md fixed-size-input`}
                style={{
                  backgroundColor: "white",
                  border: showRedBorders && !district ? "1px solid red" : "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  width: "190px",
                  height: "40px"
                }}
                // style={{ backgroundColor: "white", width:'200px', height:'40px' }}
                value={district}
                onChange={handleDistrictChange}
              >
                <option value="">Select District</option>
                {districtsOptions.map((districtOption) => (
                  <option key={districtOption} value={districtOption}>
                    {districtOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4 mt-2">
            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-2 whitespace-nowrap label-width">
                Street1 <span className="mandatory-asterisk">*</span>
              </label>
              <input
                type="text"
                // className={`border ${
                //   showRedBorders && !street1
                //     ? "border-red-500"
                //     : "border-gray-300"
                // } p-2 rounded-md  fixed-size-input`}
                style={{
                  backgroundColor: "white",
                  border: showRedBorders && !street1 ? "1px solid red" : "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  width: "190px",
                  height: "40px",
                  marginLeft:"38px"
                }}
                value={isFirstTimeRegistration ? street1 : editedData.street1}
                onChange={handleStreet1Change}
              />
            </div>

            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-2 whitespace-nowrap label-width">
                Street2 <span className="mandatory-asterisk">*</span>
              </label>
              <input
                type="text"
                placeholder="Street 2"
                // className={`border ${
                //   showRedBorders && !street2
                //     ? "border-red-500"
                //     : "border-gray-300"
                // } p-2 rounded-md  fixed-size-input`}
                style={{
                  backgroundColor: "white",
                  border: showRedBorders && !street2 ? "1px solid red" : "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  width: "190px",
                  height: "40px",
                  marginLeft:"31px"
                }}
                value={isFirstTimeRegistration ? street2 : editedData.street2}
                onChange={handleStreet2Change}
              />
            </div>

            <div className="flex flex-col items-start md:flex-row md:items-center md:mt-0">
              <label className="mb-1 mr-1 whitespace-nowrap label-width">
                Town/Village <span className="mandatory-asterisk">*</span>
              </label>
              <input
                type="text"
                style={{
                  backgroundColor: "white",
                  border: showRedBorders && !cityVillage ? "1px solid red" : "1px solid #ccc",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  width: "189px",
                  height: "40px",
                
                }}
                value={
                  isFirstTimeRegistration ? cityVillage : editedData.cityVillage
                }
                placeholder="Enter Town/Village"
                onChange={handleCityVillageChange}
              />
            </div>
          </div>
        </div>

        <div className="flex float-right  ">
            {showSubmit ? (
              <button
                onClick={handleSubmit}
                className={`bg-blue-500 text-white p-2 ml-8 mt-4 rounded-md ${
                  isSubmitDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={isSubmitDisabled}
              >
                Submit
              </button>
            ) : (
              <button
                className={`bg-green-700 text-white p-2 rounded-md ml-8 ${
                  isSubmitDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={handleSaveChanges}
                disabled={isSubmitDisabled}
              >
                Update
              </button>
            )}
            {isSubmitting && <LoadingSpinner />}
            {isUpdating && <LoadingSpinner />}
            {showSuccessMessage && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-4 rounded-md">
                Patient data submitted successfully
              </div>
            )}
            {showUpdateSuccessMessage && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-4 rounded-md">
                Patient data updated successfully
              </div>
            )}
          </div>


       

        {showAlert && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded">
            {alertMessage}
          </div>
        )}
      </div>




      {showIdCard && (
  <div className="overlay print-container" ref={printRef}>
    <div className="print-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-black p-4 shadow-lg print:w-full">
      <button
        className="absolute top-2 right-2 text-red-500 cursor-pointer"
        onClick={() => {
          handleClose();
        }}
      >
        &#10006;
      </button>
      <div ref={componentRef} className="print-container">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4">
            <img
              src={logo}
              alt="Hospital Logo"
              className="w-30 h-20 mr-2"
            />
            <h1 className="text-indigo-800 text-4xl">Linga Dental Clinic</h1>
          </div>
          <div className="flex">
            <div className="w-3/5 ml-2">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-black font-bold">UHID:</p>
                <p className="text-black">{idCardData.uhid}</p>
                <p className="text-black font-bold">Name:</p>
                <p className="text-black">{idCardData.name}</p>
                <p className="text-black font-bold">Age:</p>
                <p className="text-black">{idCardData.age}</p>
                <p className="text-black font-bold">District:</p>
                <p className="text-black">{idCardData.district}</p>
                <p className="text-black font-bold">Mobile Number:</p>
                <p className="text-black">{idCardData.mobileNumber}</p>
              </div>
            </div>
            <div className="w-1/2 flex justify-end mr-2">
              <img
                src={profile}
                alt="not found"
                className="w-30 h-30 bg-gray-300 rounded-full print:w-40 print:h-40"
              />
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 ml-2"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  </div>
)}



{!tablehide && multiplePatients && multiplePatients.length > 0 && (
  <div className=" fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 text-black p-4 rounded-md">
    <button
      className="absolute top-2 right-2 text-red-500"
      onClick={() => setTablehide(true)}
    >
      &#x2716; 
    </button>
    <h5 className="text-center mb-4">Please Select a Patient:</h5>
    <table className="w-full table-auto">
      <thead className="text-center">
        <tr>
          <th className="px-4 py-2">UHID</th>
          <th className="px-4 py-2">First Name</th>
          <th className="px-4 py-2">Last Name</th>
          <th className="px-4 py-2">Father Name</th>
          <th className="px-4 py-2">Age</th>
          <th className="px-4 py-2">Aadhar Number</th>
          <th className="px-4 py-2">Mobile Number</th>
          <th className="px-4 py-2">Select</th>
        </tr>
      </thead>
      <tbody>
        {multiplePatients.map((patient, index) => (
          <tr key={index} className="text-center">
            <td className="border px-4 py-2">{patient.uhid}</td>
            <td className="border px-4 py-2">{patient.first_Name}</td>
            <td className="border px-4 py-2">{patient.last_Name}</td>
            <td className="border px-4 py-2">{patient.father_name}</td>
            <td className="border px-4 py-2">{patient.age}</td>
            <td className="border px-4 py-2">{patient.aadhar_number}</td>
            <td className="border px-4 py-2">{patient.Mobile_number}</td>
            <td className="border px-4 py-2">
              <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handlePatientSelect(patient)}>
                Select
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
)}
    </>
 
  );
};

export default CheckboxApp;
