import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import config from '../config';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTimes, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import AppointmentsCalendar from './appointmentcalendar';

function Appointment() {
    const [formData, setFormData] = useState({
        doctorName: 'Dr.  R. Vinoth Kumar (BDS)',
        patientName: '',
        mobileNo: '',
        age: '',
        gender: '',
        medicalAffiliation: '',
        selectedDate: '',
        selectedTime: ''
    });

    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [highlightedFields, setHighlightedFields] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false); // Add state for button disabling

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAppointmentClick = () => {
        openModal();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setHighlightedFields((prevFields) => prevFields.filter((field) => field !== name));
    };

    const handlePatientNameChange = (event) => {
        const value = event.target.value;
        const regex = /^[a-zA-Z.\s]*$/;
        if (regex.test(value) || value === '') {
            setFormData({ ...formData, patientName: value });
        }
    };

    const handleMobileNoChange = (event) => {
        const value = event.target.value;
        const regex = /^[0-9]{0,10}$/;
        if (regex.test(value) || value === '') {
            setFormData({ ...formData, mobileNo: value });
        }
    };

    const handleAgeChange = (event) => {
        const value = event.target.value;
        const age = parseInt(value, 10);
        if (!isNaN(age) && age >= 0 && age <= 100) {
            setFormData({ ...formData, age: value });
        } else {
            setFormData({ ...formData, age: '' }); // Reset age to empty string if invalid value
        }
    };
    

    useEffect(() => {
        if (formData.selectedDate) {
            fetchAvailableTimeSlots();
        }
    }, [formData.selectedDate]);

    const fetchAvailableTimeSlots = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/appointment/availableTimeSlots`, {
                params: { selectedDate: formData.selectedDate }
            });
            setAvailableTimeSlots(response.data);
        } catch (error) {
            console.error('Error fetching available time slots:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = [
            "patientName",
            "mobileNo",
            "age",
            "gender",
            "medicalAffiliation",
            "selectedDate",
            "selectedTime"
        ];

        const emptyFields = requiredFields.filter(field => !formData[field]);
        if (emptyFields.length > 0) {
            setHighlightedFields(emptyFields);

            setTimeout(() => {
                setHighlightedFields([]);
            }, 3000);
            return;
        }

        // Check if selected date is not a past date
        const currentDate = new Date().toISOString().split('T')[0];
        if (formData.selectedDate < currentDate) {
            alert('Please select a future date.');
            return;
        }

        try {
            setSubmitting(true); // Disable submit button
            const response = await axios.post(`${config.apiUrl}/appointment/appointment`, formData);
            setShowSuccessMessage(true);
            setFormData({
                doctorName: 'Dr.  R. Vinoth Kumar (BDS)',
                patientName: '',
                mobileNo: '',
                age: '',
                gender: '',
                medicalAffiliation: '',
                selectedDate: '',
                selectedTime: ''
            });

            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitting(false);
        } finally {
            setSubmitting(false); // Re-enable submit button regardless of success or failure
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <style>
                {`
     .highlighted {
        border: 1px solid red;
    }
    .custom-modal {
        max-width: 1000px; 
        min-height: 400px; 
    }

    `}
            </style>
            <div className="container">
                <Row className="mb-3">
                    <Col>
                        {/* <h2><b>Appointment Form</b></h2> */}
                    </Col>
                    <Col xs="auto">
                        <div className="mt-2 " >
                            <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="cursor-pointer text-black text-2xl "
                                onClick={handleAppointmentClick}
                            />  <strong>Booked Appointment</strong>

                        </div>
                    </Col>
                </Row>



                <div
                    className="bg-white border ps-4 pe-4 pb-2 "
                >
                    <Form onSubmit={handleSubmit}>
                        <Row className="mt-3"><Col className="mb-6 text-end"><h6 className='mr-10'>Consultation Doctor  <br/></h6>
                        <strong>Dr.  R. Vinoth Kumar (BDS)</strong></Col></Row>
          

                        <Row className="mb-2">
                            <Col>
                                <Form.Group controlId="patientName">
                                    <Form.Label><b>Patient Name</b></Form.Label>
                                    <Form.Control type="text" placeholder="Enter patient name" name="patientName" value={formData.patientName} onChange={handlePatientNameChange} className={highlightedFields.includes("patientName") ? "highlighted" : ""} />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="mobileNo">
                                    <Form.Label><b>Mobile No</b></Form.Label>
                                    <Form.Control type="tel" pattern="[0-9]{10}" placeholder="Enter mobile number" name="mobileNo" value={formData.mobileNo} onChange={handleMobileNoChange} className={highlightedFields.includes("mobileNo") ? "highlighted" : ""} />
                                </Form.Group>
                            </Col>

                        </Row>

                        <Row className="mb-2">
                            <Col>
                                <Form.Group controlId="age">
                                    <Form.Label><b>Age</b></Form.Label>
                                    <Form.Control type="number" min="0" max="100" placeholder="Enter age" name="age" value={formData.age} onChange={handleAgeChange} className={highlightedFields.includes("age") ? "highlighted" : ""} />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="gender">
                                    <Form.Label><b>Gender</b></Form.Label>
                                    <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange} className={highlightedFields.includes("gender") ? "highlighted" : ""}>
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                        </Row>

                        <Row className="mb-2">
                            <Col>
                                <Form.Group controlId="selectedDate">
                                    <Form.Label><b>Date</b></Form.Label>
                                    <Form.Control type="date" value={formData.selectedDate} onChange={handleChange} name="selectedDate" min={today} className={highlightedFields.includes("selectedDate") ? "highlighted" : ""} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="selectedTime">
                                    <Form.Label><b>Time</b></Form.Label>
                                    <Form.Control as="select" value={formData.selectedTime} onChange={handleChange} name="selectedTime" className={highlightedFields.includes("selectedTime") ? "highlighted" : ""}>
                                        <option value="">Select time slot</option>
                                        {availableTimeSlots.map((timeSlot, index) => (
                                            <option key={index} value={timeSlot}>{timeSlot}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-2" controlId="medicalAffiliation">
                            <Form.Label><b>Medical Affiliation</b></Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter medical affiliation" name="medicalAffiliation" value={formData.medicalAffiliation} onChange={handleChange} className={highlightedFields.includes("medicalAffiliation") ? "highlighted" : ""} />
                        </Form.Group>


                        <Row >
                            <Col xs="auto" className="ms-auto">
                                <Button type="button" style={{ backgroundColor: "rgb(72, 194,205)", color: "white" }}>
                                    Cancel
                                </Button>
                            </Col>
                            <Col xs="auto">
                                <Button type="submit" disabled={submitting} style={{ backgroundColor: "rgb(72, 194,205)", color: "white" }}>
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                    <Alert show={showSuccessMessage}
                        className="alert alert-success alert-dismissible fade show"
                        role="alert"
                        style={{
                            position: "fixed",
                            top: "10px",
                            left: "55%",

                            backgroundColor: 'rgb(72,194,205)',
                            color: "white",
                            padding: "10px",
                            borderRadius: "5px",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                            zIndex: "9999",
                            display: "block",
                        }}
                    >
                        Appointment done successfully!
                    </Alert>

                    <Modal show={isModalOpen} onHide={closeModal} dialogClassName="custom-modal">
                        <Modal.Header closeButton>
                            <Modal.Title>Appointment Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <AppointmentsCalendar></AppointmentsCalendar>
                        </Modal.Body>
                        <Modal.Footer>

                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </>

    );
}

export default Appointment;