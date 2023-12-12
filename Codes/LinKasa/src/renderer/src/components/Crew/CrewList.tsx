import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Crew from "@renderer/model/Crew";
import { crewCollection } from "@renderer/library/Collection";
import { db } from "@renderer/config/firebase";
import { toast } from "react-toastify";

function CrewList() {
  const [crewData, setCrewData] = useState<Crew[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(crewCollection, (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const crew: Crew = {
          id: doc.id,
          crewName: data.crewName || '',
          pilot1: data.pilot1 || '',
          pilot2: data.pilot2 || '',
          attendants: data.attendants || '',
        };
        return crew;
      });

      setCrewData(updatedData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleViewDetail = (id) => {
    navigate(`/crewDetail/${id}`);
  };

  const handleRemove = async (crewId) => {
    try{
      const vacancyRef = doc(db, "Crew", crewId);
      await deleteDoc(vacancyRef);
      toast.success('👨‍✈️👨‍✈️ Crew deleted!', {
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
      toast.error('👨‍✈️👨‍✈️ Error deleting Crew!', {
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
  }

  const buildDiv = (crew) => {
    return (
      <div key={crew.id} className="bg-white p-4 m-4 rounded-md shadow-md">
        <h2 className="text-xl font-bold">{crew.crewName}</h2>
        <p className="text-gray-600">Pilot 1: {crew.pilot1.name}</p>
        <p className="text-gray-600">Pilot 2: {crew.pilot2.name}</p>
        <div className="flex">
          <button
            className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleViewDetail(crew.id)}
          >
            View Detail
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleRemove(crew.id)}
          >
            Remove
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
      <h1 className="text-3xl font-bold mt-10">View Crew</h1>
      <div className="bg-sky-200 mt-5 w-9/12">
        {crewData.map((crew) => buildDiv(crew))}
      </div>
    </div>
  );
}

export default CrewList;
