import { useRef, useState } from "react";
import Crew from "@renderer/model/Crew";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addDoc } from "firebase/firestore";
import { crewCollection } from "@renderer/library/Collection";

function CreateCrewForm() {

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

  const [crew, setCrew] = useState<Crew>(initialCrew);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!crew.crewName || !crew.pilot1.name || !crew.pilot2.name || !crew.attendants[0].name || !crew.attendants[1].name || !crew.attendants[2].name || !crew.attendants[3].name){
      toast.error("Please fill in all fields");
      return;
    }

    try{
      await addDoc(crewCollection, crew);
      toast.success('👨‍✈️👨‍✈️ Crew added!', {
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
    if (formRef.current) {
      formRef.current.reset();
    }
    setCrew(initialCrew);
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
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto p-4">
    <h1 className="text-3xl font-bold mb-4">Create Crew</h1>
    <form ref={formRef} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Crew Name:</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline-blue"
          type="text"
          value={crew.crewName}
          onChange={(e) => setCrew((prevCrew) => ({ ...prevCrew, crewName: e.target.value }))}
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
        Create Crew
      </button>
    </form>
    <ToastContainer />
  </div>
  );
}

export default CreateCrewForm;
