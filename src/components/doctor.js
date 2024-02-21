import React, { useState,useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { faTimes, faPrescriptionBottleAlt } from "@fortawesome/free-solid-svg-icons";
import config from "../config";
import axios from 'axios';
import { useReactToPrint } from "react-to-print";

const PrintScreen = ({ patientDetails, prescriptionData, onClose }) => {
  const genderText = patientDetails.gender === "M" ? "Male" : "Female";
  const componentRef = useRef(null);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrintClick = () => {
    handlePrint();
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <FontAwesomeIcon
          icon={faTimes}
          onClick={onClose}
          className="text-red-500 cursor-pointer size-6"
        />
      </div>

      <div className="border border-gray-300 p-6 rounded-lg">
        <div
          className="registration-content p-4"
          style={{
            //backgroundImage: `url(${billbg})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
          ref={componentRef}
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2 text-center">
              LINGA DENTAL CARE
            </h2>
            <p className="text-lg font-semibold mb-2 text-center">
             Shree Meenakshi Complex, Alaguraja Nagar{" "}
            </p>
            <p className=" font-semibold mb-2 text-center">AlagarKovil Main Road, Near Maruthangulam Bus Stop, Madurai - 625007. {" "}</p>
            <p className="text-lg font-semibold mb-4 text-center">
              Phno : +91 __________, 0452-______ E-mail: ldchospital@gmail.com{" "}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center text-lg font-semibold pb-8 ">
              INVOICE
            </div>

            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <div className="mr-80">
                <p>
                  <strong>Name :</strong> {patientDetails.patient_name}
                </p>
                <p>
                  <strong>UHID :</strong> {patientDetails.uhid}
                </p>
                <p>
                  <strong>Mobile Number :</strong>{" "}
                  {patientDetails.Mobile_number}
                </p>
              </div>

              <div className=" ">
                <p>
                  <strong>Age :</strong> {patientDetails.age}
                </p>
                <p>
                  <strong>Gender :</strong> {patientDetails.gender}
                </p>
              </div>
            </div>
          </div>
          <table className="w-full mt-8 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th
                  colSpan="5"
                  className="text-lg font-semibold py-2 pl-8 border-b border-gray-300 text-center"
                >
                  Prescription Details
                </th>
              </tr>
              <tr>
                <th className="pl-8 py-2 border-b border-gray-300 text-left">
                  S.No
                </th>
                <th className="pl-8 py-2 border-b border-gray-300 text-left">
                  Medicine Name
                </th>
                <th className="pl-8 py-2 border-b border-gray-300 text-left">
                  Brand
                </th>
                <th className="pl-8 py-2 border-b border-gray-300 text-left">
                  Frequency
                </th>
                <th className="pl-8 py-2 border-b border-gray-300 text-left">
                  Instruction
                </th>
              </tr>
            </thead>

            <tbody>
              {prescriptionData.map((prescription, index) => (
                <tr key={index}>
                  <td className="pl-8 py-2 border-b border-gray-300">
                    {index + 1}
                  </td>
                  <td className="pl-8 py-2 border-b border-gray-300">
                    {prescription.name}
                  </td>
                  <td className="pl-8 py-2 border-b border-gray-300">
                    {prescription.brandname}
                  </td>
                  <td className="pl-8 py-2 border-b border-gray-300">
                    {prescription.frequency}
                  </td>
                  <td className="pl-8 py-2 border-b border-gray-300">
                    {prescription.instruction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between mt-4 pl-12">
        <button
          onClick={handlePrintClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-12"
        >
          Print
        </button>
      </div>
    </>
  );
};


const Doctor = () => {
  const [isprescription, setIsprescription] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [uhid, setUHID] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const[historyData,setHistorydata]=useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState([]);
  const[viewprescription,setViewprescription]= useState(false)
  const [medicalAffiction, setMedicalAffiction] = useState('');
  const [currentMedicalAffliction, setCurrentMedicalAffliction] = useState('');
  const [isPrintTemplateVisible, setIsPrintTemplateVisible] = useState(false);


  const [patientDetails, setPatientDetails] = useState({
    patient_name: '',
    age: '',
    gender: '',
    Mobile_number: '',
  
  });
  const [prescriptionData, setPrescriptionData] = useState([
    {
      brandname: "",
      name: "",
      frequency: "",
      instruction: "",
      morning: false,
      afternoon: false,
      evening: false,
      night: false,
    },
  ]);
  const [formData, setFormData] = useState({
    patientName: "",
    uhid: "",
    age: "",
    mobileNumber: "",
    doctor: "Dr.  R. Vinoth Kumar (BDS)",
   
    date: "",
    prescription: "",
    medicalaffiction:"",
   
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeModal = () => {
    setIsPrintTemplateVisible(false);
    setIsprescription(false);
    setUHID([]);
  };

  const clearFormFields = () => {
    setUHID('');
    setFormData({
      patientName: "",
      uhid: "",
      age: "",
      mobileNumber: "",
     
      prescription: "",
      medicalaffiction: "",
    });
    setMedicalAffiction('');
    setPrescriptionData([
      {
        brandname: "",
        name: "",
        frequency: "",
        instruction: "",
        morning: false,
        afternoon: false,
        evening: false,
        night: false,
      },
    ]);
    setErrors({}); 
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const newErrors = {};
    if (!uhid) {
      newErrors.uhid = true;
    }
    
    if (!medicalAffiction) {
      newErrors.medicalaffiction = true;
    }
     // Add similar checks for other input fields
     if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      setTimeout(() => {
        setErrors({});
      }, 1000);

      setIsSubmitting(false);

      return;
    }
    
    try {
      const response = await axios.post(`${config.apiUrl}/doctor/saveprescription`, {
        uhid,
        patientName: patientDetails.patient_name,
        mobileNumber: patientDetails.Mobile_number,
        gender: patientDetails.gender,
        age: patientDetails.age,
        doctorName: 'Dr.  R. Vinoth Kumar (BDS)',
        date: currentDate,
        medicalaffiction: medicalAffiction,  
        prescription: prescriptionData
       
      });
  
      if (response.status === 200) {
        console.log(response.data.message);
        setIsPrintTemplateVisible(true);

        // clearFormFields();
      } else {
        console.error('Failed to save prescription:', response.data.error);
      }
    } catch (error) {
      console.error('Error saving prescription:', error.message);
    }
  };
  



  const handleUHIDChange = (event) => {
    const newUHID = event.target.value;
    setUHID(newUHID);

    // Clear any existing timeout to avoid multiple requests
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout to delay the API request by 2 seconds
    const newSearchTimeout = setTimeout(async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/doctor/patient/searchname?uhid=${newUHID}`);
        const { patient_name, age, gender, Mobile_number } = response.data;
        setPatientDetails({ patient_name, age, gender, Mobile_number });
      } catch (error) {
        // Handle error (e.g., patient not found)
        console.error('Error fetching patient details:', error.message);
        setPatientDetails({
          patient_name: '',
          age: '',
          gender: '',
          Mobile_number: '',
        });
      }
    }, 1000); // 2 seconds delay

    setSearchTimeout(newSearchTimeout);
  };  


  const handleCheckboxClick = (index, time) => {
    const updatedSelectedTimes = [...selectedTimes];
    updatedSelectedTimes[index] = {
      ...updatedSelectedTimes[index],
      [time]: !updatedSelectedTimes[index]?.[time],
    };
    setSelectedTimes(updatedSelectedTimes);
  };

  const handleAddMedicine = () => {
    setPrescriptionData([
      ...prescriptionData,
      {
        brandname: "",
        name: "",
        frequency: "",
        instruction: "",
        time: "",
      },
    ]);
    setEmptyFields([]);
  };

  const handleOpenprescriptionmodal = () => {
    setIsprescription(true);
    setIsPrintTemplateVisible(false);
  };
  


  const handleCloseprescriptionmodal = () => {
    setIsPrintTemplateVisible(false);
    setIsprescription(false);
  };

 

  const handleCloseviewprescriptionmodal = () => {
    setViewprescription(false);
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updatedMedicines = [...prescriptionData];
    updatedMedicines[index][field] = value;
    setPrescriptionData(updatedMedicines);

    const updatedEmptyFields = [...emptyFields];
    if (value.trim() === "" && !updatedEmptyFields.includes(index)) {
      updatedEmptyFields.push(index);
    } else if (value.trim() !== "") {
      const indexOfField = updatedEmptyFields.indexOf(index);
      if (indexOfField !== -1) {
        updatedEmptyFields.splice(indexOfField, 1);
      }
    }
    setEmptyFields(updatedEmptyFields);
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = [...prescriptionData];
    updatedMedicines.splice(index, 1);
    setPrescriptionData(updatedMedicines);
  };

  const handleOpenHistoryModal = () => {
    setHistoryModalOpen(true);
    setIsPrintTemplateVisible(false);
    handlemodel();
  };
  
  const handleCloseHistoryModal = () => {
    setHistoryModalOpen(false);
  };
 
  const handlemodel = async () => {
    try {
      // Fetch detailed prescription information using prescription.uhid or other identifier
      const response = await axios.get(`${config.apiUrl}/doctor/getprescription/all`);
      
      // Extract and set the prescription details
      const { historyData } = response.data;
      console.log(historyData);
  
      // Assuming there's a state variable to store prescription details
      setHistorydata(historyData);
  
      // Open the modal to display the prescription details
      setHistoryModalOpen(true);
    } catch (error) {
      console.error('Error fetching prescription details:', error.message);
    }
  };

  const handleViewPrescription = (prescription) => {
    const parsedPrescription = JSON.parse(prescription);
    setSelectedPrescription(parsedPrescription);
  
    setViewprescription(true);
  };
  
  
  const currentDate = new Date().toISOString().slice(0, 10);


  return (
    <div className="p-8 flex flex-col border h-100 w-98 m-2">
      
      <div className="flex flex-col">
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
          <h2 className="font-bold text-xl mb-2 ">Consultation Doctor</h2>
            <p className="font-bold  text-gray-700 ml-2">{formData.doctor}</p>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700">Date</label>
            <input 
        type="text" 
        className="mt-1 p-2 border rounded w-300" 
        value={currentDate}  
        readOnly 
      />          </div>
            

      
        </div>
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <b><label className="block text-sm font-bold text-gray-700">UHID</label></b>
            <input type="text" placeholder="UHID" 
  value={patientDetails.uhid}
  className={`mt-1 p-2 border rounded w-full`}
             onChange={handleUHIDChange}/>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700">Patient Name</label>
            <input type="text" placeholder="Patient name" className="mt-1 p-2 border rounded w-full" value={patientDetails.patient_name}
                readOnly
           />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700">Gender</label>
                <input type="text" placeholder="Gender" className="mt-1 p-2 border rounded w-full" value={patientDetails.gender}
                 readOnly
                />
              </div>
              <div className="flex-1">
                <b><label className="block text-sm font-bold text-gray-700">Age</label></b>
                <input type="text" placeholder="Age" className="mt-1 p-2 border rounded w-full" value={patientDetails.age}
          readOnly
                 />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700">Mobile Number</label>
                <input type="text" placeholder="Mobile Number" className="mt-1 p-2 border rounded w-full"value={patientDetails.Mobile_number}
          readOnly />
              </div>
            </div>
            <div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label  className={`className="block text-sm font-bold text-gray-700" ${errors.medicalaffiction? 'border-red-500' : 'border-gray-300'}`}>Medical Affliction</label>
                  <input
  type="text"
  placeholder="Enter Current Problem"
  className="mt-1 p-2 border rounded w-full"
  pattern="[0-9]+([.][0-9]+)?"
  title="Enter a value"
  value={medicalAffiction}
  onChange={(e) => setMedicalAffiction(e.target.value)}
/>
                  {errors.height && <p className="text-red-500">{errors.height}</p>}
                </div>
              </div>
            </div>
          </div>
          <div style={{display:'flex'}}>
          <span className="flex items-center text-white py-2 px-4 rounded-md mr-10" style={{background:'green'}}>
    <FontAwesomeIcon icon={faHistory} className="text-white mr-2" />
    <button onClick={handleOpenHistoryModal}> History</button>
  </span>
            <button onClick={handleOpenprescriptionmodal} className="flex items-center text-white py-2 px-4 rounded-md " style={{background:'blue'}}>
              <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="mr-2" />
              <b>Prescription</b>
            </button>
            {/* <input type="file" /> */}
          </div>
          {isprescription && (
            <div className={`fixed inset-0 overflow-y-auto ${isprescription ? "backdrop-filter backdrop-blur-sm" : ""} transition-all duration-300 ${isprescription ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <div className="flex items-center justify-center h-screen">
                <div className="bg-white p-4 rounded shadow-lg transition-transform duration-300 transform scale-100 border-2 border-blue-500 max-h-full overflow-auto" style={{ top: "3%", height: "90%", width: "90%" }}>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-3xl font-bold text-blue-500">Prescription</h2>
                    <FontAwesomeIcon icon={faTimes} onClick={handleCloseprescriptionmodal} className="text-red-500 cursor-pointer" size="lg" />
                  </div>
                  <div>
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-center">Medicine Name & Dosage</th>
                          <th className="text-center">Brand</th>
                          <th className="text-center">No. of Days</th>
                          <th className="text-center">Instruction</th>
                          <th colSpan="4" className="text-center">Time Schedule</th>
                          <th className="text-center">Action</th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th className="text-center">Morning</th>
                          <th className="text-center">Afternoon</th>
                          <th className="text-center">Evening</th>
                          <th className="text-center">Night</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescriptionData.map((prescription, index) => (
                          <tr key={index}>
                            <td>
                              <input type="text" className={`mt-1 p-2 border rounded-md w-full ${emptyFields.includes(index) && prescriptionData[index].name.trim() === "" ? "highlight-input" : ""}`} list="medicineNames" placeholder="Enter Medicine Name" value={prescriptionData[index].name} onChange={(e) => handlePrescriptionChange(index, "name", e.target.value)} />
                            </td>
                            <td>
                              <input type="text" className={`mt-1 p-2 border rounded-md w-full ${emptyFields.includes(index) && prescriptionData[index].brandname.trim() === "" ? "highlight-input" : ""}`} list="brandname" placeholder="Enter brand Name" value={prescriptionData[index].brandname || ""} onChange={(e) => handlePrescriptionChange(index, "brandname", e.target.value)} />
                            </td>
                            <td>
                              <input type="text" className={`mt-1 p-2 border rounded-md w-full ${emptyFields.includes(index) && prescriptionData[index].frequency.trim() === "" ? "highlight-input" : ""}`} list="Frequency" placeholder="Enter Frequency" value={prescriptionData[index].frequency} onChange={(e) => handlePrescriptionChange(index, "frequency", e.target.value)} />
                            </td>
                            <td>
                              <select className={`mt-1 p-3 border rounded-md w-full ${emptyFields.includes(index) && prescription.instruction.trim() === "" ? "highlight-input" : ""}`} style={{ backgroundColor: "white" }} value={prescription.instruction} onChange={(e) => { const updatedMedicines = [...prescriptionData]; updatedMedicines[index].instruction = e.target.value; setPrescriptionData(updatedMedicines); }}>
                                <option value="">Select Instruction</option>
                                <option value="Before meal">Before meal</option>
                                <option value="After meal">After meal</option>
                              </select>
                            </td>
                            <td className="text-center cursor-pointer" onClick={() => handleCheckboxClick(index, "morning")}>
                              <input type="checkbox" checked={prescription.morning} onChange={(e) => { const updatedMedicines = [...prescriptionData]; updatedMedicines[index].morning = e.target.checked; setPrescriptionData(updatedMedicines); }} />
                            </td>
                            <td className="text-center cursor-pointer" onClick={() => handleCheckboxClick(index, "afternoon")}>
                              <input type="checkbox" checked={prescription.afternoon} onChange={(e) => { const updatedMedicines = [...prescriptionData]; updatedMedicines[index].afternoon = e.target.checked; setPrescriptionData(updatedMedicines); }} />
                            </td>
                            <td className="text-center cursor-pointer" onClick={() => handleCheckboxClick(index, "evening")}>
                              <input type="checkbox" checked={prescription.evening} onChange={(e) => { const updatedMedicines = [...prescriptionData]; updatedMedicines[index].evening = e.target.checked; setPrescriptionData(updatedMedicines); }} />
                            </td>
                            <td className="text-center cursor-pointer" onClick={() => handleCheckboxClick(index, "night")}>
                              <input type="checkbox" checked={prescription.night} onChange={(e) => { const updatedMedicines = [...prescriptionData]; updatedMedicines[index].night = e.target.checked; setPrescriptionData(updatedMedicines); }} />
                            </td>
                            <td className="cursor-pointer text-center" onClick={() => handleRemoveMedicine(index)}>
                              <FontAwesomeIcon icon={faTimes} style={{ color: "red", fontSize: "1.2rem" }} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button onClick={handleAddMedicine} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md">Add Medicine</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <div>
          {isHistoryModalOpen && (
        <div className={`fixed inset-0 overflow-y-auto ${isHistoryModalOpen ? "backdrop-filter backdrop-blur-sm" : ""} transition-all duration-300 ${isHistoryModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-4 rounded shadow-lg transition-transform duration-300 transform scale-100 border-2 border-blue-500 max-h-full overflow-auto" style={{ top: "3%", height: "90%", width: "90%" }}>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-3xl font-bold text-blue-500">Patient History</h2>
                <FontAwesomeIcon icon={faTimes} onClick={handleCloseHistoryModal} className="text-red-500 cursor-pointer" size="lg" />            

              </div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border p-2">S.No</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">UHID</th>
                   
                    <th className="border p-2">Patient Name</th>
                    <th className="border p-2">Mobile Number</th>
                    <th className="border p-2">medicalAffiction</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                
                <tbody>
              
                {historyData.map((history, index) => {
  console.log(history); // Add this line to check the content of each history object
  return (
    <tr key={index}>
      <td className="border p-2">{index + 1}</td>
      <td className="border p-2">{new Date(history.date).toLocaleDateString()}</td>
      <td className="border p-2">{history.uhid}</td>
      <td className="border p-2">{history.patientname}</td>
      <td className="border p-2">{history.mobile_number}</td>
      <td className="border p-2">{history.medicalaffiction}</td>

      <td className="border p-2">
      <button className="text-blue-500 underline cursor-pointer" onClick={() => handleViewPrescription(history.prescription)} >
  View
</button>
      </td>
    </tr>
  );
})}
                </tbody>
              </table>
              
            </div>
          </div>
        </div>
      )}
       {viewprescription && (
        <div className={`fixed inset-0 overflow-y-auto ${viewprescription ? "backdrop-filter backdrop-blur-sm" : ""} transition-all duration-300 ${viewprescription ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-4 rounded shadow-lg transition-transform duration-300 transform scale-100 border-2 border-blue-500 max-h-full overflow-auto" style={{ top: "3%", height: "90%", width: "90%" }}>
              Prescription Table  
              <FontAwesomeIcon icon={faTimes} onClick={handleCloseviewprescriptionmodal} className="text-red-500 cursor-pointer float-right" size="lg"  />            
            
         
               <table className="w-full">
    <thead>
      <tr>
        <th className="border p-2">Name</th>
        <th className="border p-2">Frequency</th>
        <th className="border p-2">Instruction</th>
        <th className="border p-2">Brandname</th>
        <th className="border p-2">Morning</th>
        <th className="border p-2">Evening</th>
        <th className="border p-2">Afternoon</th>
        <th className="border p-2">Night</th>
      </tr>
    </thead>
    <tbody>
      {selectedPrescription.map((prescription, index) => (
        <tr key={index}>
          <td className="border p-2">{prescription.name}</td>
          <td className="border p-2">{prescription.frequency}</td>
          <td className="border p-2">{prescription.instruction}</td>
          <td className="border p-2">{prescription.brandname}</td>
          <td className="border p-2">{prescription.morning ? "Yes" : "No"}</td>
          <td className="border p-2">{prescription.evening ? "Yes" : "No"}</td>
          <td className="border p-2">{prescription.afternoon ? "Yes" : "No"}</td>
          <td className="border p-2">{prescription.night ? "Yes" : "No"}</td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>
          </div>
        </div>
      )}
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={handleSubmit}>Submit</button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => {}}>Cancel</button>
          </div>
        </div>
        {isPrintTemplateVisible && (
          <div
            className={`fixed inset-0 overflow-y-auto ${
              isPrintTemplateVisible ? "backdrop-filter backdrop-blur-sm" : ""
            } transition-all duration-300 ${
              isPrintTemplateVisible
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center justify-center h-screen">
              <div
                className={`bg-white p-4 w-1/2 md:w-1/2 lg:w-3/4 rounded shadow-lg transition-transform duration-300 transform ${
                  isPrintTemplateVisible ? "scale-100" : "scale-0"
                } border-2 border-blue-500 max-h-full overflow-auto`}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0, 0, 0, 0.5) transparent",
                }}
              >
                <PrintScreen
  patientDetails={{ ...patientDetails, uhid: uhid }}
  prescriptionData={prescriptionData}
                  onClose={() => {
                    // setShowPrintScreen(false);
                    // setSelectedPatient(null);
                    closeModal();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctor;