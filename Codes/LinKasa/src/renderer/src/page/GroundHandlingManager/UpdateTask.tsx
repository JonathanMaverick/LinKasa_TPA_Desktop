import SideBar from "@renderer/components/SideBar";
import { db } from "@renderer/config/firebase";
import Task from "@renderer/model/Task";
import User from "@renderer/model/User";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { taskCollection, userCollection } from "@renderer/library/Collection";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateTask(){

  const initialTask: Task = {
    id: "",
    name: "",
    startDate: "",
    deadlineDate: "",
    location: "",
    description: "",
    status: "",
    staff: {
      documentId: '',
      email: '',
      name: '',
      birthdate: '',
      roles: '',
      profilePicture: '',
      department: '',
    },
  };

  const { taskId } = useParams();
  const [task , setTask] = useState<Task>(initialTask);
  const [error, setError] = useState<string | null>(null);
  const [staffOptions, setStaffOptions] = useState<User[]>([])
  const formRef = useRef<HTMLFormElement | null>(null);

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
      const querySnapshot = await getDocs(userCollection);

      return querySnapshot.docs
        .filter((doc) => doc.data().roles === 'Ground Handling Staff')
        .map((doc) => {
          const { email, name, birthdate, roles, profilePicture , department} = doc.data();
          return { documentId: doc.id, email, name, birthdate, roles, profilePicture, department };
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
        department: selectedStaff?.department || '',
      },
    }));
  };

  const areSchedulesOverlapping = (schedule1, schedule2) => {
    console.log(schedule1, schedule2)
    const startDate1 = new Date(schedule1.startDate);
    const endDate1 = new Date(schedule1.deadlineDate);
    const startDate2 = new Date(schedule2.startDate);
    const endDate2 = new Date(schedule2.deadlineDate);

    return (
      (startDate1 <= startDate2 && startDate2 <= endDate1) ||
      (startDate1 <= endDate2 && endDate2 <= endDate1) ||
      (startDate2 <= startDate1 && startDate1 <= endDate2) ||
      (startDate2 <= endDate1 && endDate1 <= endDate2)
    );
  };


  const handleTask = async (e) => {
    e.preventDefault();
    if(!taskId)return;
    if (!task.name || !task.deadlineDate || !task.startDate || !task.location || !task.description || !task.status) {
      setError("Please fill all the fields");
      return;
    }

    const existingSchedulesSnapshot = await getDocs(taskCollection);
    const filteredSchedules = existingSchedulesSnapshot.docs.filter(doc => doc.id !== taskId);

    const schedulesSpecificStaff = filteredSchedules.map(doc => doc.data());

    const schedulesSpecificStaffFiltered = schedulesSpecificStaff.filter(
      (schedule) => schedule.staff.documentId === task.staff.documentId
    );

    const overlappingSchedule = schedulesSpecificStaffFiltered.find((schedule) =>
      areSchedulesOverlapping(schedule, task)
    );

    if (overlappingSchedule) {
      setError('The selected staff has an overlapping schedule.');
      return;
    }

    try{
      setDoc(doc(db, 'Task', taskId), {
        name : task.name,
        startDate : task.startDate,
        deadlineDate : task.deadlineDate,
        location : task.location,
        description : task.description,
        status : task.status,
        staff : {
          documentId : task.staff.documentId,
          name : task.staff.name,
        }
      });
    toast.success('📝 Task updated!', {
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
      setError('Failed to add maintenance schedule!')
    }

    if (formRef.current) {
      formRef.current.reset();
    }
    setError('');
  }

  return (
    <>
      <div className="flex">
        <SideBar />
        <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
          <h1 className="text-4xl font-bold mb-8">Update Task</h1>
          <form ref={formRef} onSubmit={handleTask} className="bg-white p-6 rounded-md shadow-md w-96">
          <div className="mb-4">
            <label htmlFor="taskName" className="block text-sm font-medium text-gray-600">
              Task Name:
            </label>
            <input
              type="text"
              id="taskName"
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-600">
              Start Date:
            </label>
            <input
              type="date"
              id="deadlineDate"
              value={task.startDate}
              disabled
              onChange={(e) => setTask({ ...task, startDate: e.target.value })}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-600">
              Deadline Date:
            </label>
            <input
              type="date"
              id="deadlineDate"
              min = {task.startDate}
              value={task.deadlineDate}
              onChange={(e) => setTask({ ...task, deadlineDate: e.target.value })}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-600">
              Location:
            </label>
            <input
              type="text"
              id="location"
              value={task.location}
              onChange={(e) => setTask({ ...task, location: e.target.value })}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="staff" className="block text-sm font-medium text-gray-600">
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
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-600">
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Task</option>
              <option value="Pending">Pending</option>
              <option value="On Working">On Working</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-600">
            Description:
          </label>
          <textarea
          id="description"
          rows={6}
          className="w-full p-2 border border-gray-300 resize-none"
          value={task.description}
          onChange={(e) => {
            setTask({...task, description : e.target.value});
          }}
          ></textarea>
          </div>
          <div className="flex flex-col justify-center text-center">
            <p className="pt-2 mb-2 font-bold text-red-400">{error}</p>
            <button
              type="submit"
              className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 focus:outline-none focus:ring focus:border-sky-700"
            >
              Update Task
            </button>
          </div>
        </form>
        <ToastContainer />
        </div>
      </div>
    </>
  )
};

export default UpdateTask;
