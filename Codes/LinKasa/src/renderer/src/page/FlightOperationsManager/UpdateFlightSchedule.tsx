import { useEffect, useState } from "react";
import FlightSchedule from "@renderer/model/FlightSchedule";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { db } from "@renderer/config/firebase";
import SideBar from "@renderer/components/SideBar";
import Crew from "@renderer/model/Crew";
import { crewCollection } from "@renderer/library/Collection";

function UpdateFlightSchedule()
{

  const initialFlightSchedule : FlightSchedule = {
    id : '',
    airplaneID : '',
    boardingTime : '',
    arrivalTime : '',
    pointsOrigin : '',
    pointsDestination : '',
    status : '',
    crewId: '',
  }

  const { flightId } = useParams();
  const [flightSchedule, setFlightSchedule] = useState<FlightSchedule>(initialFlightSchedule);
  const [error, setError] = useState<string | null>(null);
  const [crew, setCrew] = useState<Crew[]>([]);

  useEffect(() => {
    const fetchCrew = async () => {
      const crewList = await getCrew();
      setCrew(crewList);
    };

    fetchCrew();
  }, []);

  const getCrew = async () => {
    try {
      const querySnapshot = await getDocs(crewCollection);

      return querySnapshot.docs
        .map((doc) => {
          const { crewName, pilot1, pilot2, attendants } = doc.data();
          return { id: doc.id, crewName, pilot1, pilot2, attendants };
        });
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (flightId) {
          const flightDocRef = doc(db, 'FlightSchedule', flightId);
          const flightDocSnapshot = await getDoc(flightDocRef);

          if (flightDocSnapshot.exists()) {
            const flightScheduleData = flightDocSnapshot.data() as FlightSchedule;
            setFlightSchedule(flightScheduleData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [flightId]);

  const handleFlightSchedule = async (e) => {
    if(!flightId){
      return;
    }

    e.preventDefault();
    if(!flightSchedule.airplaneID || !flightSchedule.boardingTime || !flightSchedule.arrivalTime || !flightSchedule.pointsOrigin || !flightSchedule.pointsDestination)
    {
      setError('Please fill all the fields');
      return;
    }

    const flightNumberRegex = /^[A-Z]{2}\d{3}$/;
    if (!flightNumberRegex.test(flightSchedule.airplaneID)) {
      setError('Invalid flight number format. It should be in [XX000] format.');
      return;
    }

    if (new Date(flightSchedule.boardingTime) > new Date(flightSchedule.arrivalTime)) {
      setError('Start date cannot exceed end date.');
      return;
    }

    try{
      const flightDocRef = doc(db, 'FlightSchedule', flightId);
      await setDoc(flightDocRef, {
        airplaneID: flightSchedule.airplaneID,
        boardingTime: flightSchedule.boardingTime,
        arrivalTime: flightSchedule.arrivalTime,
        pointsOrigin: flightSchedule.pointsOrigin,
        pointsDestination: flightSchedule.pointsDestination,
        status: flightSchedule.status,
        crewId: flightSchedule.crewId,
      });
      toast.success('✈️ Flight Schedule Updated!', {
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
  }

  const handleCrewChange = (event) => {
    const selectedCrewId = event.target.value;
    const selectedCrew = crew.find((crew) => crew.id === selectedCrewId);

    if(selectedCrew){
      setFlightSchedule((prevSchedule) => ({
        ...prevSchedule,
        crewId: selectedCrewId || '',
      }));
    }
  };

  return (
    <>
    <div className="flex bg-sky-200 h-screen">
    <SideBar />
    <div className="bg-sky-200 flex flex-col justify-center items-center h-screen w-full">
      <h1 className="text-3xl font-bold">Update Flight Schedule</h1>
      <form onSubmit={handleFlightSchedule} className="flex flex-col mt-5 w-6/12 gap-2">
      <label htmlFor="crew">
          Select Crew:
        </label>
        <select
          id="airplaneID"
          placeholder='Airplane ID'
          className="border p-2 rounded-lg focus:outline-none"
          value={flightSchedule.crewId}
          onChange={handleCrewChange}
        >
          <option value="">Select Staff</option>
          {crew.map((c) => (
            <option key={c.id} value={c.id}>
              {c.crewName}
            </option>
          ))}
        </select>
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
      <label htmlFor="status">
        Status:
      </label>
      <select
        id="status"
        name="status"
        value={flightSchedule.status}
        onChange={(e) => setFlightSchedule({ ...flightSchedule, status: e.target.value })}
        className="border p-2 rounded-lg focus:outline-none"
      >
        <option value="">Select Status</option>
        <option value="Delayed">Delayed</option>
        <option value="Arrived">Unclaimed</option>
        <option value="In-Transit">In Transit</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <p className="pt-2 font-bold text-red-400">{error}</p>
      <button type="submit" className="p-2 mt-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Update Flight Schedule </button>
      </form>
    </div>
    <ToastContainer />
    </div>
    </>
  )
}

export default UpdateFlightSchedule;
