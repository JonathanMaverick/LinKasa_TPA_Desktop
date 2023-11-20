import { taskCollection } from "@renderer/library/Collection";
import Task from "@renderer/model/Task";
import { addDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TaskForm() {

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

  const [task, setTask] = useState<Task>(initialTask);
  const [error, setError] = useState<string | null>(null);
  const [minDate, setMinDate] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);


  const handleTask = async (e) => {
    e.preventDefault();
    if (!task.name || !task.deadlineDate || !task.location) {
      setError("Please fill all the fields");
      return;
    }

    try{
      addDoc(taskCollection, {
        name: task.name,
        deadlineDate: task.deadlineDate,
        location: task.location,
        staff:{
          name: '',
        }
      });
    toast.success('📝 Task added!', {
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
    setTask(initialTask);
    setError('');

  }

  return (
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8">TaskForm</h1>
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
          <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-600">
            Deadline Date:
          </label>
          <input
            type="date"
            id="deadlineDate"
            min = {minDate}
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
        <div className="flex flex-col justify-center text-center">
          <p className="pt-2 mb-2 font-bold text-red-400">{error}</p>
          <button
            type="submit"
            className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 focus:outline-none focus:ring focus:border-sky-700"
          >
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default TaskForm;
