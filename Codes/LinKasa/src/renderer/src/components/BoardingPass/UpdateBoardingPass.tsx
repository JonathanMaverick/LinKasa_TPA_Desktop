import { useEffect, useRef, useState } from "react";
import { doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { db } from "@renderer/config/firebase";
import SideBar from "@renderer/components/SideBar";
import BoardingPass from "@renderer/model/BoardingPass";
import User from "@renderer/model/User";
import FlightSchedule from "@renderer/model/FlightSchedule";
import { flightScheduleCollection, userCollection } from "@renderer/library/Collection";

function UpdateBoardingPass(){

  const formRef = useRef<HTMLFormElement>(null);
  const [passengerList, setPassenger] = useState<User[]>([]);
  const [flightScheduleList, setFlightSchedule] = useState<FlightSchedule[]>([]);

  const initialBoardingPass : BoardingPass = {
    id : '',
    flightScheduleID : '',
    passengerID : '',
    seat : '',
    gate : '',
    terminal : ''
  }
  const {boardingPassId} = useParams();
  const [boardingPass, setBoardingPass] = useState<BoardingPass>(initialBoardingPass);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (boardingPassId) {
          const boardingPassDocRef = doc(db, 'BoardingPass', boardingPassId);
          const boardingPassDocSnapshot = await getDoc(boardingPassDocRef);

          if (boardingPassDocSnapshot.exists()) {
            const boardingPassData = boardingPassDocSnapshot.data() as BoardingPass;
            setBoardingPass(boardingPassData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchCrew = async () => {
      const crewList = await getFlightSchedule();
      const passengerList = await getPassenger();
      setFlightSchedule(crewList);
      setPassenger(passengerList);
    };

    fetchCrew();

    fetchData();
  }, [boardingPassId]);

  const getPassenger = async () => {
    try {
      const q = query(userCollection, where('roles', '==', 'Passenger'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map((doc) => {
          const passenger = doc.data() as User;
          passenger.documentId = doc.id;
          return passenger;
        });
    } catch (error) {
      return [];
    }
  }

  const getFlightSchedule = async () => {
    try {
      const querySnapshot = await getDocs(flightScheduleCollection);

      return querySnapshot.docs
        .map((doc) => {
          const flightSchedule = doc.data() as FlightSchedule;
          flightSchedule.id = doc.id;
          return flightSchedule;
        });
    } catch (error) {
      return [];
    }
  };

  const handlePassengerChange = (event) => {
    const selectPassengerID = event.target.value;
    const selectedCrew = passengerList.find((passenger) => passenger.documentId === selectPassengerID);

    if(selectedCrew){
      setBoardingPass((prevSchedule) => ({
        ...prevSchedule,
        passengerID: selectPassengerID || '',
      }));
    }
  };

  const handleFlightScheduleChange = (event) => {
    const selectFlightScheduleID = event.target.value;
    const selectedSchedule = flightScheduleList.find((schedule) => schedule.id === selectFlightScheduleID);

    if (selectedSchedule) {
      setBoardingPass((prevBoardingPass) => ({
        ...prevBoardingPass,
        flightScheduleID: selectedSchedule.id || '',
      }));
    }
  };

  const handleBoardingPass = async (e) => {
    e.preventDefault();
    if(!boardingPassId) return;

    if(!boardingPass.flightScheduleID || !boardingPass.passengerID || !boardingPass.seat || !boardingPass.gate || !boardingPass.terminal)
    {
      setError('Please fill all the fields');
      return;
    }

    const seatRegex = /^\d{2}[A-Z]$/;
    if (!seatRegex.test(boardingPass.seat)) {
      setError('Invalid seat format');
      return;
    }

    const gateNumber = parseInt(boardingPass.gate, 10);
    if (isNaN(gateNumber) || gateNumber < 1 || gateNumber > 25) {
      setError('Invalid gate number. Please enter a number between 1 and 25.');
      return;
    }

    const terminalNumber = parseInt(boardingPass.terminal, 10);
    if (isNaN(terminalNumber) || terminalNumber < 1 || terminalNumber > 4) {
      setError('Invalid terminal number. Please enter a number between 1 and 4.');
      return;
    }

    try{
      const boardingPassRef = doc(db, 'BoardingPass', boardingPassId);
      await setDoc(boardingPassRef, {
        flightScheduleID : boardingPass.flightScheduleID,
        passengerID : boardingPass.passengerID,
        seat : boardingPass.seat,
        gate : boardingPass.gate,
        terminal : boardingPass.terminal
      });
      toast.success('🎫 Boarding Pass Updated!', {
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
      setError('Failed to add vacancy');
      return;
    }
    setError(null);
  }

  return (
    <div className="flex bg-sky-200 h-screen">
      <SideBar />
      <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full">
      <h1 className="text-3xl font-bold">Update Boarding Pass</h1>
      <form ref={formRef} onSubmit={handleBoardingPass} className="flex flex-col mt-5 w-6/12 gap-2">
      <label htmlFor="passenger">Select Passenger: </label>
      <select id="passenger"
          placeholder="Passenger ID"
          className="border p-2 rounded-lg focus:outline-none"
          value={boardingPass.passengerID}
          onChange={handlePassengerChange}
        >
        <option value="">Select Passenger</option>
          {passengerList.map((p) => (
            <option key={p.documentId} value={p.documentId}>
              {p.name}
            </option>
        ))}
      </select>
      <label htmlFor="flight">Select Flight: </label>
      <select id="flight"
          placeholder="Flight ID"
          className="border p-2 rounded-lg focus:outline-none"
          value={boardingPass.flightScheduleID}
          onChange={handleFlightScheduleChange}
        >
        <option value="">Select Flight</option>
          {flightScheduleList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.airplaneID}
            </option>
          ))}
      </select>
      <label htmlFor="seat">
        Seat:
      </label>
      <input
        type="text"
        id="seat"
        className="border p-2 rounded-lg focus:outline-none"
        placeholder="Example 1A, 16K, or 12C"
        value={boardingPass.seat}
        onChange={(e) => setBoardingPass({ ...boardingPass, seat: e.target.value })}
      />
      <label htmlFor="gate">
        Gate:
      </label>
      <input
        type="text"
        id="gate"
        className="border p-2 rounded-lg focus:outline-none"
        value={boardingPass.gate}
        onChange={(e) => setBoardingPass({ ...boardingPass, gate: e.target.value })}
      />
      <label htmlFor="terminal">
        Terminal:
      </label>
      <input
        type="text"
        id="terminal"
        className="border p-2 rounded-lg focus:outline-none"
        value={boardingPass.terminal}
        onChange={(e) => setBoardingPass({ ...boardingPass, terminal: e.target.value })}
      />
      <p className="pt-2 font-bold text-red-400">{error}</p>
      <button type="submit" className="p-2 mt-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Update Boarding Pass </button>
      </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default UpdateBoardingPass
