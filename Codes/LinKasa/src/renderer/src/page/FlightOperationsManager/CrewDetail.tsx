import { db } from "@renderer/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Crew from "@renderer/model/Crew";
import SideBar from "@renderer/components/SideBar";

const initialCrew = {
  id : '',
  crewName: '',
  pilot1: { name: '', role: 'Pilot' },
  pilot2: { name: '', role: 'Pilot' },
  attendants: [
    { name: '', role: 'Attendant' },
    { name: '', role: 'Attendant' },
    { name: '', role: 'Attendant' },
    { name: '', role: 'Attendant' },
  ],
};

function CrewDetail() {
  const { crewId } = useParams();
  const [crew, setCrew] = useState<Crew>(initialCrew);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!crewId) {
          return;
        }
        const crewDocRef = doc(db, 'Crew', crewId);
        const crewDocSnapshot = await getDoc(crewDocRef);

        if (crewDocSnapshot.exists()) {
          const userData = crewDocSnapshot.data() as Crew;
          setCrew(userData);
        }
      } catch (error) {
        toast.error('Error fetching data');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!crewId)return;
    if(!crew.crewName || !crew.pilot1.name || !crew.pilot2.name || !crew.attendants[0].name || !crew.attendants[1].name || !crew.attendants[2].name || !crew.attendants[3].name){
      toast.error("Please fill in all fields");
      return;
    }

    try{
      const crewDocRef = doc(db, 'Crew', crewId);
      await setDoc(crewDocRef, crew);
      toast.success('👨‍✈️👨‍✈️ Crew Updated!', {
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
      toast.error('👨‍✈️👨‍✈️ Crew error!', {
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



  const handleAttendantChange = (index: number, name: string) => {
    const updatedAttendants = [...crew.attendants];
    updatedAttendants[index].name = name;
    setCrew((prevCrew) => ({
      ...prevCrew,
      attendants: updatedAttendants,
    }));
  };

  return (
    <div className="flex bg-sky-200 h-screen">
    <SideBar />
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto p-4">
    <h1 className="text-3xl font-bold mb-4">Create Crew</h1>
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Crew Name:</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline-blue"
          type="text"
          value={crew.crewName}
          onChange={(e) => setCrew({ ...crew, crewName: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Pilot 1:</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline-blue"
          type="text"
          value={crew.pilot1.name}
          onChange={(e) => setCrew((prevCrew) => ({ ...prevCrew, pilot1: { ...prevCrew.pilot1, name: e.target.value } }))}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Pilot 2:</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline-blue"
          type="text"
          value={crew.pilot2.name}
          onChange={(e) => setCrew((prevCrew) => ({ ...prevCrew, pilot2: { ...prevCrew.pilot2, name: e.target.value } }))}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Attendants:</label>
        {crew.attendants.map((attendant, index) => (
          <input
            key={index}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline-blue mb-2"
            type="text"
            value={attendant.name}
            onChange={(e) => handleAttendantChange(index, e.target.value)}
          />
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
      >
        Update Crew
      </button>
    </form>
    <ToastContainer />
  </div>
  </div>
  );
}

export default CrewDetail;
