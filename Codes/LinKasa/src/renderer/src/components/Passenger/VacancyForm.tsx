import { useState } from "react";
import { vacancyCollection } from "@renderer/library/Collection";
import { addDoc } from "firebase/firestore";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VacancyForm(){
    const roles = [
      "Customer Service Manager",
      "Information Desk Staff",
      "Lost and Found Staff",
      "Check-in Staff",
      "Gate Agents",
      "Air Operations Manager",
      "Flight Operations Manager",
      "Ground Handling Manager",
      "Ground Handling Staff",
      "Landside Operations Manager",
      "Maintenance Manager",
      "Maintenance Staff",
      "Customs and Border Control Officers",
      "Baggage Security Supervisor",
      "Baggage Security Staff",
      "Cargo Manager",
      "Logistic Manager",
      "Fuel Manager",
      "Cargo Handlers",
      "Civil Engineering Manager",
      "Airport Director/CEO",
      "Chief Financial Officer (CFO)",
      "Chief Operation Officer (COO)",
      "Chief Security Officer (CSO)",
      "Human Resources Director",
    ];

    const [role, setRoles] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleVacancy = async (e) => {
      e.preventDefault();
      if(!role){
        setError('Please select a role');
        return;
      }

      try{
        await addDoc(vacancyCollection, {
          role: role,
        });
        toast.success('👨‍✈️ Job Vacancy Added!', {
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
      setRoles('');
      setError(null);
    }

    return (
      <>
      <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full">
        <div className="max-w-wd mt-8 p-6 bg-white rounded-md shadow-md">
          <form action="" onSubmit={handleVacancy}>
            <div className="mb-4">
              <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
                Roles
              </label>
              <select
                id="roles"
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={role}
                onChange={(e) => setRoles(e.target.value)}
                >
                <option value="">Select a role</option>
                {roles.map((role, index) => (
                  <option key={index} value={role} className="bg-white text-gray-800">
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
              >
              Submit
            </button>
          </form>
          <p className="pt-2 font-bold text-red-400">{error}</p>
        </div>
        <ToastContainer />
      </div>
      </>
    )
}

export default VacancyForm
