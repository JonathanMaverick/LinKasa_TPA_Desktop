import { useRef, useState } from "react";
import FlightSchedule from "@renderer/model/FlightSchedule";
import { flightScheduleCollection } from "../../library/Collection";
import { addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FlightScheduleForm()
{

  const formRef = useRef<HTMLFormElement | null>(null);
  const initialFlightSchedule : FlightSchedule = {
    id : '',
    airplaneID : '',
    boardingTime : '',
    arrivalTime : '',
    pointsOrigin : '',
    pointsDestination : '',
    status : ''
  }

  const [flightSchedule, setFlightSchedule] = useState<FlightSchedule>(initialFlightSchedule);
  const [error, setError] = useState<string | null>(null);

  const handleFlightSchedule = async (e) => {
    e.preventDefault();
    if(!flightSchedule.airplaneID || !flightSchedule.boardingTime || !flightSchedule.arrivalTime || !flightSchedule.pointsOrigin || !flightSchedule.pointsDestination)
    {
      setError('Please fill all the fields');
      return;
    }

    const flightNumberRegex = /^[A-Z]{3}-\d{2}$/;
    if (!flightNumberRegex.test(flightSchedule.airplaneID)) {
      setError('Invalid flight number format. It should be in [XXX-00] format.');
      return;
    }

    if (new Date(flightSchedule.boardingTime) > new Date(flightSchedule.arrivalTime)) {
      setError('Start date cannot exceed end date.');
      return;
    }

    try{
      await addDoc(flightScheduleCollection, {
        airplaneID : flightSchedule.airplaneID,
        boardingTime : flightSchedule.boardingTime,
        arrivalTime : flightSchedule.arrivalTime,
        pointsOrigin : flightSchedule.pointsOrigin,
        pointsDestination : flightSchedule.pointsDestination,
        status : 'Not Departed'
      });
      toast.success('✈️ Flight Schedule Created!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }catch{
      setError('Failed to add flight schedule');
    }

    if (formRef.current) {
      formRef.current.reset();
    }
    setError('');
    setFlightSchedule(initialFlightSchedule);
  }

  return (
    <>
    <div className="bg-sky-200 flex flex-col justify-center items-center h-screen w-full">
      <h1 className="text-3xl font-bold">Create Flight Schedule</h1>
      <form ref={formRef} onSubmit={handleFlightSchedule} className="flex flex-col mt-5 w-6/12 gap-2">
      <label htmlFor="airplaneID">Airplane ID</label>
      <input
        id="airplaneID"
        placeholder='Airplane ID'
        className="border p-2 rounded-lg focus:outline-none"
        type="text"
        value={flightSchedule.airplaneID}
        onChange={(e) => setFlightSchedule({ ...flightSchedule, airplaneID: e.target.value })}
        />
      <label htmlFor="startDate">
        Boarding Date and Time:
      </label>
      <input
        type="datetime-local"
        id="startDate"
        name="startDate"
        className="border p-2 rounded-lg focus:outline-none"
        value={flightSchedule.boardingTime}
        onChange={(e) => setFlightSchedule({ ...flightSchedule, boardingTime: e.target.value })}
      />
      <label htmlFor="endDate">
        Arrival Date and Time:
      </label>
      <input
        type="datetime-local"
        id="endDate"
        name="endDate"
        className="border p-2 rounded-lg focus:outline-none"
        value={flightSchedule.arrivalTime}
        onChange={(e) => setFlightSchedule({ ...flightSchedule, arrivalTime: e.target.value })}
      />
      <label htmlFor="pointsOrigin">Origin Point</label>
      <input
        id="pointsOrigin"
        placeholder='From'
        className="border p-2 rounded-lg focus:outline-none"
        type="text"
        value={flightSchedule.pointsOrigin}
        onChange={(e) => setFlightSchedule({ ...flightSchedule, pointsOrigin: e.target.value })}
        />
      <label htmlFor="pointsDestination">Destination Point</label>
      <input
        id="pointsDestination"
        placeholder='Destination'
        className="border p-2 rounded-lg focus:outline-none"
        type="text"
        value={flightSchedule.pointsDestination}
        onChange={(e) => setFlightSchedule({ ...flightSchedule, pointsDestination: e.target.value })}
        />
      <p className="pt-2 font-bold text-red-400">{error}</p>
      <button type="submit" className="p-2 mt-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Create Flight Schedule </button>
      </form>
    </div>
    <ToastContainer />
    </>
  )
}

export default FlightScheduleForm;
