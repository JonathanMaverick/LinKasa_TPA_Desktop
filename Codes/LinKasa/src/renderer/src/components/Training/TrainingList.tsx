import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { trainingCollection } from "@renderer/library/Collection";
import Training from "@renderer/model/Training";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "@renderer/config/firebase";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "@renderer/library/UserAuthContext";
import { useAuthState } from "react-firebase-hooks/auth";

function TrainingList() {
  const [trainingData, setTrainingData] = useState<Training[]>([]);
  const navigate = useNavigate();
  const {roles} = useUserAuth();
  const [user] = useAuthState(auth);
  const userId = user?.uid;

  useEffect(() => {
    const unsubscribe = onSnapshot(trainingCollection, (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const training: Training = {
          id : doc.id,
          trainingName: data.trainingName || '',
          startTime: data.startTime || '',
          endTime: data.endTime || '',
          date: data.date || '',
          staff: {
            documentId: data.staff.documentId || '',
            email: data.staff.email || '',
            name: data.staff.name || '',
            birthdate: data.staff.birthdate || '',
            roles: data.staff.roles || '',
            profilePicture: data.staff.profilePicture || '',
            department: data.staff.department || '',
          },
        };
        return training;
      });
      if(isHRD){
        setTrainingData(updatedData);
      }else{
        const userTraining = updatedData.filter(task => task.staff.documentId === userId);
        setTrainingData(userTraining);
      }
    });

    return () => {
      unsubscribe();
    };
  },[]);

  const isHRD = roles === "Human Resources Director";

  const removeTraining = async (trainingId) => {
    try{
      const vacancyRef = doc(db, "Training", trainingId);
      await deleteDoc(vacancyRef);
      toast.success('💪 Training Removed!', {
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
      toast.error('💪 Failed to remove Training!', {
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

  const updateTraining = async (trainingId) => {
    navigate(`/updateTraining/${trainingId}`)
  }

  const buildDiv = (data: Training) => {
    return (
      <div key={data.id} className="relative border p-4 mb-4 bg-white rounded-md shadow-md">
        <div className="flex flex-col justify-center text-center">
          <p className="text-lg font-semibold mb-2">{data.trainingName}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <p className="text-gray-600">Date:</p>
              <p>{data.date}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600">Time:</p>
              <p>{data.startTime} - {data.endTime}</p>
            </div>
          </div>
          <p className="font-semibold mt-4">Staff: {data.staff.name}</p>
        </div>
        {isHRD &&
        <div className="flex flex-row absolute bottom-2 right-2 gap-3">
          <button onClick={() => removeTraining(data.id)} className="bg-red-600 text-white py-2 px-4 rounded-md">Remove</button>
          <button onClick={() => updateTraining(data.id)} className="bg-yellow-600 text-white py-2 px-4 rounded-md">Update</button>
        </div>
        }
      </div>
    );
  };


  return (
    <>
     <div className="bg-sky-200 flex flex-col min-h-screen justify-center items-center w-full overflow-y-auto">
        <h1 className="text-3xl font-bold my-10">View All Training</h1>
        <div className="bg-sky-200 mt-5 w-9/12">
          {trainingData.map((item) => buildDiv(item))}
        </div>
      </div>
      <ToastContainer />
    </>
  );

}

export default TrainingList;
