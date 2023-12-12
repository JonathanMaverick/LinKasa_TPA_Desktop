import { db } from "@renderer/config/firebase";
import { useUserAuth } from "@renderer/library/UserAuthContext";
import FlightSchedule from "@renderer/model/FlightSchedule";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FlightScheduleList() {
  const [flightScheduleData, setFlightScheduleData] = useState<FlightSchedule[]>([]);
  const { roles } = useUserAuth();
  const navigate = useNavigate();
  const canSeeDetailButton = roles === "Flight Operations Manager";

  function formatDateTime(dateTimeString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };

    const dateTime = new Date(dateTimeString);
    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(dateTime);

    return formattedDateTime;
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'FlightSchedule'), (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const flightSchedule: FlightSchedule = {
          id : doc.id,
          airplaneID : data.airplaneID,
          boardingTime : formatDateTime(data.boardingTime),
          arrivalTime : formatDateTime(data.arrivalTime),
          pointsOrigin : data.pointsOrigin,
          pointsDestination : data.pointsDestination,
          status : data.status,
          crewId : data.crewId,
        };
        return flightSchedule;
      });

      setFlightScheduleData(updatedData);
    });

    return () => {
      unsubscribe();
    };
  },[]);

  const handleDetailButtonClick = async(flightId) => {
    navigate(`/updateFlightSchedule/${flightId}`);
  }

  const handleRemoveSchedule = async (flightId) => {
    try{
      const scheduleRef = doc(db, "FlightSchedule", flightId);
      await deleteDoc(scheduleRef);
      toast.success('✈️ Flight Schedule Removed!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }catch (error) {
      toast.error('✈️ Failed to remove schedule!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Departed':
        return 'text-blue-600';
      case 'Delayed':
        return 'text-yellow-500';
      case 'Arrived':
        return 'text-green-600';
      case 'In-Transit':
        return 'text-purple-600';
      case 'Cancelled':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const buildDiv = (data: FlightSchedule) => (
    <div className="border border-gray-300 bg-white p-4 m-4 rounded-md shadow-md">
      <div>
        <p className="font-bold text-xl">{data.airplaneID}</p>
        <p>{`${data.pointsOrigin} - ${data.pointsDestination}`}</p>
        <p>{`${data.boardingTime} - ${data.arrivalTime}`}</p>
        <p className={`${getStatusColor(data.status)}`}>{data.status}</p>
      </div>
      <div>
        {canSeeDetailButton && (
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleDetailButtonClick(data.id)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md cursor-pointer">
              Detail
            </button>
            <button onClick={() => handleRemoveSchedule(data.id)}
             className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer">
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
      <h1 className="text-4xl font-bold">View Flight Schedule</h1>
      <div className="bg-sky-200 mt-5 w-10/12">
        {flightScheduleData.map((schedule) => buildDiv(schedule))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default FlightScheduleList;
