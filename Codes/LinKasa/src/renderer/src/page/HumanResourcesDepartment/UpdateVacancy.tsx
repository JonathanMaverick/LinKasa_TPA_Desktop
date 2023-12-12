import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Vacancy from "@renderer/model/Vacancy";
import { useParams } from "react-router-dom";
import { db } from "@renderer/config/firebase";
import SideBar from "@renderer/components/SideBar";

function UpdateVacancy(){
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

    const initialVacancy = {
      id: '',
      role: '',
      description: '',
      salary: 0,
    }

    const {vacancyId} = useParams();
    const [vacancy, setVacancy] = useState<Vacancy>(initialVacancy);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          if (vacancyId) {
            const vacancyDocRef = doc(db, 'Vacancy', vacancyId);
            const vacancyDocSnapshot = await getDoc(vacancyDocRef);

            if (vacancyDocSnapshot.exists()) {
              const vacancyData = vacancyDocSnapshot.data() as Vacancy;
              setVacancy(vacancyData);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, [vacancyId]);

    const handleVacancy = async (e) => {
      e.preventDefault();
      if(!vacancyId) return;

      if(!vacancy.role || !vacancy.description || !vacancy.salary){
        setError('Please fill all the fields')
        return;
      }

      try{
        const vacancyRef = doc(db, 'Vacancy', vacancyId);
        await setDoc(vacancyRef, {
          role: vacancy.role,
          description: vacancy.description,
          salary: vacancy.salary,
        });
        toast.success('👨‍✈️ Job Vacancy Updated!', {
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
      <>
      <div className="flex bg-sky-200 h-screen">
      <SideBar />
        <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full">
          <h1 className="text-3xl font-bold">Update Job Vacancy</h1>
          <div className="max-w-wd mt-8 p-6 bg-white rounded-md shadow-md">
            <form action="" onSubmit={handleVacancy}>
              <div className="mb-4">
                <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
                  Roles
                </label>
                <select
                  id="roles"
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={vacancy.role}
                  onChange={(e) => setVacancy({...vacancy, role: e.target.value})}
                >
                  <option value="">Select a role</option>
                  {roles.map((role, index) => (
                    <option key={index} value={role} className="bg-white text-gray-800">
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 resize-none"
                  value={vacancy.description}
                  onChange={(e) => setVacancy({...vacancy, description: e.target.value})}
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <input
                  type="number"
                  id="salary"
                  className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={vacancy.salary}
                  onChange={(e) => setVacancy({...vacancy, salary: Number(e.target.value)})}
                />
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
      </div>
      </>
    )
}

export default UpdateVacancy
