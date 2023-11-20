import SideBar from "@renderer/components/SideBar";
import { db } from "@renderer/config/firebase";
import Task from "@renderer/model/Task";
import User from "@renderer/model/User";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AssignStaff(){

  const initialTask: Task = {
    id: "",
    name: "",
    deadlineDate: "",
    location: "",
    staff: {
      documentId: '',
      email: '',
      name: '',
      birthdate: '',
      roles: '',
      profilePicture: '',
    },
  };

  const { taskId } = useParams();
  const [task , setTask] = useState<Task>(initialTask);
  const [error, setError] = useState<string | null>(null);
  const [staffOptions, setStaffOptions] = useState<User[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (taskId) {
          const taskDocRef = doc(db, 'Task', taskId);
          const taskDocSnapshot = await getDoc(taskDocRef);

          if (taskDocSnapshot.exists()) {
            const taskData = taskDocSnapshot.data() as Task;
            setTask(taskData);
          }
        }

        const staffList = await getGroundHandlingStaff();
        setStaffOptions(staffList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [taskId]);

  const getGroundHandlingStaff = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));

      return querySnapshot.docs
        .filter((doc) => doc.data().roles === 'Ground Handling Staff')
        .map((doc) => {
          const { email, name, birthdate, roles, profilePicture } = doc.data();
          return { documentId: doc.id, email, name, birthdate, roles, profilePicture };
        });
    } catch (error) {
      return [];
    }
  };

  const handleStaffChange = (event) => {
    const selectedStaff = staffOptions.find((staff) => staff.documentId === event.target.value);
    setTask((prevSchedule) => ({
      ...prevSchedule,
      staff: {
        documentId: selectedStaff?.documentId || '',
        email: selectedStaff?.email || '',
        name: selectedStaff?.name || '',
        birthdate: selectedStaff?.birthdate || '',
        roles: selectedStaff?.roles || '',
        profilePicture: selectedStaff?.profilePicture || '',
      },
    }));
  };

  const handleAssignStaff = async (e) => {
    e.preventDefault();

    if(!taskId)return;

    if (!task.staff.documentId) {
      setError("Please select a staff");
      return;
    }

    try{
      const taskDocRef = doc(db, 'Task', taskId);
      const assignedStaff = {
        staff: {
          documentId: task.staff.documentId,
          name: task.staff.name,
        },
      }

      await updateDoc(taskDocRef, assignedStaff);
      toast.success('👨🏻‍💻 Staff Assigned!', {
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
      setError('Failed to assign staff!')
    }
    setError('')
  }

  return (
    <>
      <div className="flex bg-gradient-to-br from-blue-200 via-blue-300 to-sky-200 h-screen">
        <SideBar />

        <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
          <form
            action=""
            onSubmit={handleAssignStaff}
            className="bg-white p-8 rounded-md shadow-md w-1/2"
          >
            <h1 className="text-3xl font-semibold mb-2">{task.name}</h1>
            <p className="font-semibold mb-2">{task.location}</p>
            <p className="mb-5">{task.deadlineDate}</p>

            <label htmlFor="staff" className="block text-sm font-medium text-gray-600 mb-2">
              Select Staff:
            </label>

            <select
              id="staff"
              name="staff"
              value={task.staff.documentId}
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
            <p className="pt-2 font-bold text-red-400 mb-3">{error}</p>
            <button
              type="submit"
              className="mt-4 bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 focus:outline-none focus:ring focus:border-sky-700"
            >
              Assign Staff
            </button>
          </form>
        <ToastContainer />
        </div>
      </div>
    </>
  )
};

export default AssignStaff;
