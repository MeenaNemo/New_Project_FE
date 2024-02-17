import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes, faPrescriptionBottleAlt 
} from "@fortawesome/free-solid-svg-icons";
import config from "../config";


const Doctor = () => {

    const [isprescription, setIsprescription] = useState(false);
    const storedUserData = localStorage.getItem("user");
    const [emptyFields, setEmptyFields] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);

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
        patientName: '',
        uhid: '',
        age: '',
        mobileNumber: '',
        doctor: '',
        department: '',
        date: '',
        height: '',
        weight: '',
        bloodPressure: '',
        temperature: '',
        prescription: '', // Assuming this is a JSON object
        description: ''
      });

      const handleSubmit = (event) => {
        event.preventDefault();

        const patientName = document.querySelector('input[placeholder="Patient name"]').value;
    const uhid = document.querySelector('input[placeholder="UHID"]').value;
    const age = document.querySelector('input[placeholder="Age"]').value;
    const mobileNumber = document.querySelector('input[placeholder="Mobile Number"]').value;
    const doctorName = document.querySelector('input[placeholder="Consultation fees"]').value;
    const department = document.querySelector('input[placeholder="Department"]').value;
    const date = document.querySelector('input[placeholder="Date"]').value;
    const height = document.querySelector('input[placeholder="Enter Height"]').value;
    const weight = document.querySelector('input[placeholder="Enter Weight"]').value;
    const bp = document.querySelector('input[placeholder="Enter Height"]').value;
    const temperature = document.querySelector('input[placeholder="Enter Height"]').value;

    const dataToSend = {
        patientName,
        uhid,
        age,
        mobileNumber,
        doctorName,
        department,
        date,
        height,
        weight,
        bp,
        temperature,
    };

    if (prescriptionData !== 0) {
        dataToSend.prescription = prescriptionData;
        console.log('prescription',prescriptionData);
    }

    sendDataToBackend(dataToSend);
};


const sendDataToBackend = (data) => {
    fetch(`${config.apiUrl}/doctor/saveprescription`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
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
    }

    const handleCloseprescriptionmodal = () => {
        setIsprescription(false);
    }

    const [errors, setErrors] = useState({
        height: '',
        bloodPressure: '',
        weight: '',
        temperature: '',
        currentProblem: '',
    });

    // const handlePrescriptionChange = (fieldName, value) => {
    //     setPrescriptionData(prevData => ({
    //         ...prevData,
    //         [fieldName]: value
    //     }));
    // };

    const handlePrescriptionChange = (index, field, value) => {
        const updatedMedicines = [...prescriptionData];
        updatedMedicines[index][field] = value;
        setPrescriptionData(updatedMedicines);
    
        const updatedEmptyFields = [...
            emptyFields];
        if (value.trim() === "" && !updatedEmptyFields.includes(index)) {
          updatedEmptyFields.push(index); // Field is empty, add to emptyFields
        } else if (value.trim() !== "") {
          const indexOfField = updatedEmptyFields.indexOf(index);
          if (indexOfField !== -1) {
            updatedEmptyFields.splice(indexOfField, 1);
          }
        }
        setEmptyFields(updatedEmptyFields);
    
        // if (field === "name") {
        //   setSelectedMedicine(value);
        // }
      };
      
    const handleRemoveMedicine = (index) => {
        const updatedMedicines = [...prescriptionData];
        updatedMedicines.splice(index, 1);
        setPrescriptionData(updatedMedicines);
      };


    return (

        <div className=" p-8 flex flex-col bg-blue-200 h-screen w-100">

            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <div className="mb-6 mt-10">
                        <h2 className="font-bold text-xl mb-2 text-gray-700">Consultation Doctor</h2>
                    </div>

                </div>
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold  text-gray-700">Patient Name</label>
                                <input type="text" placeholder="Patient name" className="mt-1 p-2 border rounded w-full"/>
                                     
                            </div>
                            <div className="flex-1">
                                <b><label className="block text-sm font-bold text-gray-700">UHID</label></b>
                                <input type="text" placeholder="UHID" className="mt-1 p-2 border rounded w-full"/>
                            </div>
                            <div className="flex-1">
                                <b><label className="block text-sm font-bold text-gray-700">Age</label></b>
                                <input type="text" placeholder="Age" className="mt-1 p-2 border rounded w-full"/>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700">Mobile Number</label>
                                <input type="text" placeholder="Mobile Number" className="mt-1 p-2 border rounded w-full"/>
                            </div>

                        </div>

                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700">Doctor</label>
                                <input type="text" placeholder="Consultation fees" className="mt-1 p-2 border rounded w-full"/>
                                    
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700">Department</label>
                                <input type="text" placeholder="Department" className="mt-1 p-2 border rounded w-full"/>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700">Date</label>
                                <input type="text" placeholder="Date" className="mt-1 p-2 border rounded w-full"
                                    // value={(() => {
                                    //     const utcDate = new Date(selectedPatient.date || selectedPatient.registration_date);
                                    //     const istDate = utcDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                                    //     const dateOnly = istDate.split(',')[0];
                                    //     const [day, month, year] = dateOnly.split('/');
                                    //     const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                                    //     return formattedDate;
                                    // })()} 
                                     />
                            </div>
                        </div>

                        <div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700">Height (cm)</label>
                                    <input type="text" placeholder="Enter Height" className="mt-1 p-2 border rounded w-full" pattern="[0-9]+([.][0-9]+)?" title="Enter a value"
                                        onKeyPress={(e) => {
                                            const charCode = e.which ? e.which : e.keyCode;
                                            if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    />
                                    {errors.height && <p className="text-red-500">{errors.height}</p>}

                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700">Weight (kg)</label>
                                    <input type="text" placeholder="Enter Weight" className="mt-1 p-2 border rounded w-full" pattern="[0-9]+([.][0-9]+)?" title="Enter a value"
                                        onKeyPress={(e) => {
                                            const charCode = e.which ? e.which : e.keyCode;
                                            if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                                                e.preventDefault();
                                            }
                                        }} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                                    {errors.weight && <p className="text-red-500">{errors.weight}</p>}

                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700">BP (mmHg) </label>
                                    <input type="text" placeholder="Enter Height" className="mt-1 p-2 border rounded w-full" pattern="[0-9]+([.][0-9]+)?" title="Enter a value"
                                        onKeyPress={(e) => {
                                            const charCode = e.which ? e.which : e.keyCode;
                                            if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                                                e.preventDefault();
                                            }
                                        }} onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })} />
                                    {errors.bloodPressure && <p className="text-red-500">{errors.bloodPressure}</p>}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700">Temperature (°C)</label>
                                    <input type="text" placeholder="Enter Height" className="mt-1 p-2 border rounded w-full" pattern="[0-9]+([.][0-9]+)?" title="Enter a value"
                                        onKeyPress={(e) => {
                                            const charCode = e.which ? e.which : e.keyCode;
                                            if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                                                e.preventDefault();
                                            }
                                        }} onChange={(e) => setFormData({ ...formData, temperature: e.target.value })} />
                                    {errors.temperature && <p className="text-red-500">{errors.temperature}</p>}
                                </div>
                            </div>


                        </div>
                    </div>
                    <div>
    <button onClick={handleOpenprescriptionmodal} className="flex items-center text-black py-2 px-4 rounded-md">
        <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="mr-2" />
        <b>Prescription</b>
    </button>

    <input type ="file"/>
</div>

{isprescription && (
    <div className={`fixed inset-0 overflow-y-auto ${isprescription ? 'backdrop-filter backdrop-blur-sm' : ''} transition-all duration-300 ${isprescription ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-4 rounded shadow-lg transition-transform duration-300 transform scale-100 border-2 border-blue-500 max-h-full overflow-auto" style={{ top: '3%', height: '90%', width: '90%' }}>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-3xl font-bold text-blue-500">Prescription</h2>
                    <FontAwesomeIcon
                        icon={faTimes}
                        onClick={handleCloseprescriptionmodal}
                        className="text-red-500 cursor-pointer"
                        size="lg"
                    />
                </div>
                <div>

                <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-center">Medicine Name & Dosage</th>
                        <th className="text-center">Brand</th>
                        <th className="text-center">No. of Days</th>
                        <th className="text-center">Instruction</th>
                        <th colSpan="4" className="text-center">
                          Time Schedule
                        </th>
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
                            <input
                              type="text"
                              className={`mt-1 p-2 border rounded-md w-full 
                              ${
                                emptyFields.includes(index) &&
                                prescriptionData[index].name.trim() === ""
                                  ? "highlight-input"
                                  : ""
                              }`}
                              list="medicineNames"
                              placeholder="Enter Medicine Name"
                              value={prescriptionData[index].name}
                              onChange={(e) =>
                                handlePrescriptionChange(index, "name", e.target.value)
                              }
                            />
                            
                          </td>

                          <td>
                            <input
                              type="text"
                              className={`mt-1 p-2 border rounded-md w-full 
        ${
          emptyFields.includes(index) &&
          prescriptionData[index].brandname.trim() === ""
            ? "highlight-input"
            : ""
        }`}
                              list="brandname"
                              placeholder="Enter brand Name"
                              value={prescriptionData[index].brandname || ""}
                              onChange={(e) =>
                                handlePrescriptionChange(
                                  index,
                                  "brandname",
                                  e.target.value
                                )
                              }
                            />
                            {/* <datalist id="brandname">
                              {brandNames.map((suggestion, index) => (
                                <option
                                  key={index}
                                  value={suggestion.brandname}
                                />
                              ))}
                            </datalist> */}
                          </td>

                          <td>
                            <input
                              type="text"
                              className={`mt-1 p-2 border rounded-md w-full 
                              ${
                                emptyFields.includes(index) &&
                                prescriptionData[index].frequency.trim() === ""
                                  ? "highlight-input"
                                  : ""
                              }`}
                              list="Frequency"
                              placeholder="Enter Frequency"
                              value={prescriptionData[index].frequency}
                              onChange={(e) =>
                                handlePrescriptionChange(
                                  index,
                                  "frequency",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <select
                              className={`mt-1 p-3 border rounded-md w-full 
    ${
      emptyFields.includes(index) && prescription.instruction.trim() === ""
        ? "highlight-input"
        : ""
    }`}
                              style={{ backgroundColor: "white" }}
                              value={prescription.instruction}
                              onChange={(e) => {
                                const updatedMedicines = [...prescriptionData];
                                updatedMedicines[index].instruction =
                                  e.target.value;
                                setPrescriptionData(updatedMedicines);
                              }}
                            >
                              <option value="">Select Instruction</option>
                              <option value="Before meal">Before meal</option>
                              <option value="After meal">After meal</option>
                            </select>
                          </td>

                          <td
                            className="text-center cursor-pointer"
                            onClick={() =>
                              handleCheckboxClick(index, "morning")
                            }
                          >
                            <input
                              type="checkbox"
                              checked={prescription.morning}
                              onChange={(e) => {
                                const updatedMedicines = [...prescriptionData];
                                updatedMedicines[index].morning =
                                  e.target.checked;
                                setPrescriptionData(updatedMedicines);
                              }}
                            />
                          </td>
                          <td
                            className="text-center cursor-pointer"
                            onClick={() =>
                              handleCheckboxClick(index, "afternoon")
                            }
                          >
                            <input
                              type="checkbox"
                              checked={prescription.afternoon}
                              onChange={(e) => {
                                const updatedMedicines = [...prescriptionData];
                                updatedMedicines[index].afternoon =
                                  e.target.checked;
                                setPrescriptionData(updatedMedicines);
                              }}
                            />
                          </td>
                          <td
                            className="text-center cursor-pointer"
                            onClick={() =>
                              handleCheckboxClick(index, "evening")
                            }
                          >
                            <input
                              type="checkbox"
                              checked={prescription.evening}
                              onChange={(e) => {
                                const updatedMedicines = [...prescriptionData];
                                updatedMedicines[index].evening =
                                  e.target.checked;
                                setPrescriptionData(updatedMedicines);
                              }}
                            />
                          </td>
                          <td
                            className="text-center cursor-pointer"
                            onClick={() => handleCheckboxClick(index, "night")}
                          >
                            <input
                              type="checkbox"
                              checked={prescription.night}
                              onChange={(e) => {
                                const updatedMedicines = [...prescriptionData];
                                updatedMedicines[index].night =
                                  e.target.checked;
                                setPrescriptionData(updatedMedicines);
                              }}
                            />
                          </td>

                          <td
                            className="cursor-pointer text-center"
                            onClick={() => handleRemoveMedicine(index)}
                          >
                            <FontAwesomeIcon
                              icon={faTimes}
                              style={{
                                color: "red",
                                fontSize: "1.2rem",
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                    <button
                        onClick={handleAddMedicine}
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
                    >
                        Add Medicine
                    </button>
                </div>
            </div>
        </div>
    </div>
)}


                </div>

                <div className="flex justify-end mt-4">
                    <div>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                        // disabled={!selectedPatient} 
                         onClick={handleSubmit}
                        >
                            Submit
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                                // fetchInitialData();
                                // setSelectedPatient(null);
                            }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>



        </div>
    );
};

export default Doctor;