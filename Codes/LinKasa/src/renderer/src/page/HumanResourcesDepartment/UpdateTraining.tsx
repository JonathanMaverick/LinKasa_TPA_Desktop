import Training from "@renderer/model/Training"
import User from "@renderer/model/User";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { userCollection } from "@renderer/library/Collection";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { db } from "@renderer/config/firebase";
import SideBar from "@renderer/components/SideBar";

function UpdateTraining(){
  const initialTraining : Training = {
    id : '',
    trainingName : '',
    startTime : '',
    endTime : '',
    date : '',
    staff : {
      documentId: '',
      department: '',
      email: '',
      name: '',
      birthdate: '',
      roles: '',
      profilePicture: '',
    }
  }

  const [training, setTraining] = useState<Training>(initialTraining);
  const [minDate, setMinDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [staffOptions, setStaffOptions] = useState<User[]>([])
  const { trainingId } = useParams();

  useEffect(() => {
    const fetchStaff = async () => {
      const staffList = await getStaff();
      setStaffOptions(staffList);
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tomorrowISOString = tomorrow.toISOString().split('T')[0];
    setMinDate(tomorrowISOString);

    fetchStaff();

    const fetchData = async () => {
      try {
        if (trainingId) {
          const trainingDocRef = doc(db, 'Training', trainingId);
          const trainingDocSnapshot = await getDoc(trainingDocRef);

          if (trainingDocSnapshot.exists()) {
            const trainingData = trainingDocSnapshot.data() as Training;
            setTraining(trainingData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [trainingId]);

  const getStaff = async () => {
    try {
      const querySnapshot = await getDocs(userCollection);

      return querySnapshot.docs
        .filter((doc) => doc.data().roles !== 'Passenger')
        .map((doc) => {
          const { email, name, birthdate, roles, profilePicture, department } = doc.data();
          return { documentId: doc.id, email, name, birthdate, roles, profilePicture, department };
        });
    } catch (error) {
      return [];
    }
  };

  const handleStaffChange = (event) => {
    const selectedStaff = staffOptions.find((staff) => staff.documentId === event.target.value);
    setTraining((prevTraining) => ({
      ...prevTraining,
      staff: {
        documentId: selectedStaff?.documentId || '',
        email: selectedStaff?.email || '',
        name: selectedStaff?.name || '',
        birthdate: selectedStaff?.birthdate || '',
        roles: selectedStaff?.roles || '',
        profilePicture: selectedStaff?.profilePicture || '',
        department: selectedStaff?.department || '',
      },
    }));
  };

  const handleTrainingSchedule = async (e) => {
    e.preventDefault();
    if (!trainingId) return;

    if(!training.trainingName || !training.startTime || !training.endTime || !training.date || !training.staff.documentId){
      setError('Please fill all the fields');
      return;
    }

    if (new Date(training.startTime) > new Date(training.endTime)) {
      setError('Start date cannot exceed end date.');
      return;
    }

    setError(null);

    try {
      const trainingDocRef = doc(db, 'Training', trainingId);
      await setDoc(trainingDocRef, {
        trainingName: training.trainingName,
        startTime: training.startTime,
        endTime: training.endTime,
        date: training.date,
        staff: {
          documentId: training.staff.documentId,
          name: training.staff.name,
        },
      });
      toast.success('💪 Training added!', {
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
      catch{
        setError('Failed to add training!')
      }

      setError('');
  }

  return(
    <>
    <div className="flex bg-sky-200 h-screen">
      <SideBar />
     <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
     <h1 className="text-3xl font-bold">Update Staff Training</h1>
     <form action="" onSubmit={handleTrainingSchedule} className="flex flex-col mt-5 w-6/12 gap-2">
      <label htmlFor="training">Training Overview</label>
        <input
          id="training"
          placeholder='Please insert training overview'
          className="border p-2 rounded-lg focus:outline-none"
          type="text"
          value={training.trainingName}
          onChange={(e) => setTraining({ ...training, trainingName: e.target.value })}
          />
        <label htmlFor="startTime">Start Time</label>
        <input
          id="startTime"
          placeholder='Please insert start time'
          className="border p-2 rounded-lg focus:outline-none"
          type="time"
          value={training.startTime}
          onChange={(e) => setTraining({ ...training, startTime: e.target.value })}
          />
        <label htmlFor="startTime">End Time</label>
        <input
          id="startTime"
          placeholder='Please insert start time'
          className="border p-2 rounded-lg focus:outline-none"
          type="time"
          value={training.endTime}
          onChange={(e) => setTraining({ ...training, endTime: e.target.value })}
          />
        <label htmlFor="date">Date</label>
        <input
          id="date"
          placeholder='Please insert date'
          className="border p-2 rounded-lg focus:outline-none"
          type="date"
          min = {minDate}
          value={training.date}
          onChange={(e) => setTraining({ ...training, date: e.target.value })}
          />
        <label htmlFor="staff">Select Staff:</label>
        <select
          id="staff"
          name="staff"
          value={training.staff.documentId}
          onChange={handleStaffChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Staff</option>
          {staffOptions.map((staff) => (
            <option key={staff.documentId} value={staff.documentId}>
              {staff.name}
            </option>
          ))}
        </select>
        <p className="pt-2 font-bold text-red-400">{error}</p>
        <button type="submit" className="p-2 my-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Add Employee </button>
     </form>
     <ToastContainer />
    </div>
    </div>
    </>
  )
}

export default UpdateTraining
