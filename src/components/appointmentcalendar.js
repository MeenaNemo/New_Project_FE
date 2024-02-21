import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import config from '../config';

const localizer = momentLocalizer(moment);

const AppointmentsCalendar = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get(`${config.apiUrl}/appointments`)
      .then(response => {
        setAppointments(response.data.map(appointment => ({
          appoint: appointment.mobileNo,
          title: appointment.patientName,
          start: moment(`${appointment.selectedDate} ${appointment.selectedTime}`, 'YYYY-MM-DD hh:mm A').toDate(),
          end: moment(`${appointment.selectedDate} ${appointment.selectedTime}`, 'YYYY-MM-DD hh:mm A').add(30, 'minutes').toDate(),
        })));
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

 
  const Agenda = ({ event }) => (
    <div >
      <div><b>Patient Name:</b> {event.title}</div>
      <div><b>Mobile No:</b> {event.appoint}</div>
    </div>
  );

  return (
    <div>
      <style>
        {
          `.rbc-event{
            background-color: rgb(72,194,205); 
          }
         .rbc-agenda-table tbody {
            background-color: rgb(72,194,205); 
            color:black;
          }
          `
        }
      </style>
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        timeslots={1}
        min={moment().set({ hour: 17, minute: 0 }).toDate()}
        max={moment().set({ hour: 20, minute: 0 }).toDate()}
        step={30}
        views={['month', 'week', 'day', 'agenda']}
        
        components={{
          agenda: {
            event: Agenda,
          },
        }}
      />
    </div>
  );
};

export default AppointmentsCalendar;