import { deleteDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { boardingPassCollection, flightScheduleCollection, userCollection } from "@renderer/library/Collection";
import { db } from "@renderer/config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BoardingPass from "@renderer/model/BoardingPass";
import User from "@renderer/model/User";
import FlightSchedule from "@renderer/model/FlightSchedule";

function BoardingPassList() {
  const [boardingPassData, setBoardingPassData] = useState<BoardingPass[]>([]);
  const navigate = useNavigate();

  const getUserData = async (userID: string) => {
    const userDoc = await getDoc(doc(userCollection, userID));

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  };

  const getFlightData = async (flightID: string) => {
    const flightDoc = await getDoc(doc(flightScheduleCollection, flightID));

    if (flightDoc.exists()) {
      return flightDoc.data();
    } else {
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(boardingPassCollection, async (snapshot) => {
      const receivedBoardingPass: BoardingPass[] = [];
      for (const doc of snapshot.docs) {
        const boardingPassData = doc.data() as BoardingPass;
        const userData = await getUserData(boardingPassData.passengerID) as User;
        const flightData = await getFlightData(boardingPassData.flightScheduleID) as FlightSchedule;
        receivedBoardingPass.push({ ...boardingPassData, id: doc.id, userData , flightData});
      }
      setBoardingPassData(receivedBoardingPass);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdate = (id) => {
    navigate(`/updateBoardingPass/${id}`);
  };

  const handleDelete = async (id) => {
    if(!id){
      return;
    }
    const boardingPassDocRef = doc(db, 'BoardingPass', id);
    await deleteDoc(boardingPassDocRef);
    toast.success('🎫 Boarding Pass deleted!', {
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

  const buildDiv = (data: BoardingPass) => {
    return (
      <>
      <div className="bg-white rounded-lg shadow-lg p-5 my-5 flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{data.flightData?.airplaneID}</div>
              <div className="text-xl font-semibold">{data.flightData?.pointsOrigin} - {data.flightData?.pointsDestination}</div>
            </div>
            <div className="flex flex-row">
              <div>Name:</div>
              <div className="ml-2 font-semibold">{data.userData?.name}</div>
            </div>
            <div className="flex flex-row">
              <div>Seat:</div>
              <div className="ml-2 font-semibold">{data.seat}</div>
            </div>
            <div className="flex flex-row">
              <div>Gate:</div>
              <div className="ml-2 font-semibold">{data.gate}</div>
            </div>
            <div className="flex flex-row">
              <div>Terminal:</div>
              <div className="ml-2 font-semibold">{data.terminal}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <button className="bg-blue-500 text-white rounded-lg py-2 px-4 my-2" onClick={() => handleUpdate(data.id)}>
              Update
            </button>
            <button className="bg-red-500 text-white rounded-lg py-2 px-4 my-2" onClick={() => handleDelete(data.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
    );
  };

  return (
    <>
     <div className="bg-sky-200 flex flex-col min-h-screen justify-center items-center w-full overflow-y-auto">
        <h1 className="text-3xl font-bold my-10">View Boarding Pass</h1>
        <div className="bg-sky-200 mt-5 w-9/12">
          {boardingPassData.map((item) => buildDiv(item))}
        </div>
      </div>
      <ToastContainer />
    </>
  );

}

export default BoardingPassList;
