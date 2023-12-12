import Training from "@renderer/model/Training"
import User from "@renderer/model/User";
import { addDoc, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { trainingCollection, userCollection } from "@renderer/library/Collection";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TrainingForm(){
  const initialTraining : Training = {
    id : '',
    trainingName : '',
    startTime : '',
    endTime : '',
    date : '',
    staff : {
      documentId: '',
      email: '',
      name: '',
      birthdate: '',
      roles: '',
      profilePicture: '',
      department: '',
    }
  }

  const [training, setTraining] = useState<Training>(initialTraining);
  const [minDate, setMinDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [staffOptions, setStaffOptions] = useState<User[]>([])
  const formRef = useRef<HTMLFormElement | null>(null);


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
  }, []);

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
      await addDoc(trainingCollection, {
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

      if (formRef.current) {
        formRef.current.reset();
      }

      setTraining(initialTraining);
      setError('');
  }

  return(
    <>
     <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
     <h1 className="text-3xl font-bold">Assign Staff Training</h1>
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
        <button type="submit" className="p-2 my-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Add Training </button>
     </form>
     <ToastContainer />
    </div>
    </>
  )
}

export default TrainingForm
