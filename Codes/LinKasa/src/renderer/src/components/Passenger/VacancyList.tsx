import { useEffect, useState } from "react";
import { vacancyCollection } from "@renderer/library/Collection";
import { addDoc, deleteDoc, doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useUserAuth } from "@renderer/library/UserAuthContext";
import Vacancy from "@renderer/model/Vacancy";
import { auth, db } from "@renderer/config/firebase";
import { toast , ToastContainer} from "react-toastify";
import { applicantCollection } from "@renderer/library/Collection";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

function VacancyList()
{
  const [vacancyData, setVacancyData] = useState<Vacancy[]>([]);
  const {roles, username} = useUserAuth();
  const isHRD = roles === "Human Resources Director";
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(vacancyCollection, (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const lostItem: Vacancy = {
          id : doc.id,
          role: data.role || '',
          description: data.description || '',
          salary: data.salary || 0,
        };
        return lostItem;
      });

      setVacancyData(updatedData);
    });

    return () => {
      unsubscribe();
    };
  },[]);

  const removeVacancy = async (vacancyId) => {
    try{
      const vacancyRef = doc(db, "Vacancy", vacancyId);
      await deleteDoc(vacancyRef);
      toast.success('👨‍✈️ Vacancy Removed!', {
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
      toast.error('👨‍✈️ Failed to remove Vacancy!', {
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

  const applyVacancy = async (vacancy) => {
    if(!user){
      toast.error('User not authorized', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      return;
    }

    const q = query(
      applicantCollection,
      where('userID', '==', user.uid),
      where('vacancyID', '==', vacancy.id)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      toast.warn('You have already applied for this vacancy!', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    } else {
      try{
        await addDoc(applicantCollection, {
          userID: user.uid,
          role: vacancy.role,
          name: username,
          vacancyID: vacancy.id,
        });
      }catch {
        toast.error('👨‍✈️ Failed to apply for vacancy!', {
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
  }

  const updateVacancy = async (vacancyId) => {
    navigate(`/updateJobVacancy/${vacancyId}`)
  }

  const buildDiv = (vacancy : Vacancy) => {
    return (
      <div key={vacancy.id} className="bg-white p-6 rounded-md shadow-md mb-4">
        <h1 className="text-2xl font-bold mb-4">{vacancy.role}</h1>
        <p className="text-gray-600 mb-2">{vacancy.description}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 font-bold">Salary: {vacancy.salary}</span>
          <div>
          {isHRD ? (
            <div className="flex gap-2">
              <button
              onClick={() => updateVacancy(vacancy.id)}
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              >
                Update
              </button>
              <button
                onClick={() => removeVacancy(vacancy.id)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                Remove
              </button>
            </div>
            ) : (
            <button
            onClick={() => applyVacancy(vacancy)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Apply
            </button>
          )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-sky-200 flex flex-col min-h-screen justify-center items-center w-full overflow-y-auto">
        <h1 className="text-3xl font-bold my-10">Vacancy List</h1>
        <div className="bg-sky-200 mt-5 w-9/12">
          {vacancyData.map((vacancy) => buildDiv(vacancy))}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default VacancyList;
