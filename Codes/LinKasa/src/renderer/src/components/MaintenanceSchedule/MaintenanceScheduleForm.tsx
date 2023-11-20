import { useEffect, useRef, useState } from 'react';
import MaintenanceSchedule from '@renderer/model/MaintenanceSchedule';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { maintenanceScheduleCollection } from '@renderer/library/Collection';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from '@renderer/config/firebase';
import User from '@renderer/model/User';

function MaintenanceScheduleForm() {

  const initialMaintenanceSchedule: MaintenanceSchedule = {
    id: '',
    type: '',
    equipment: '',
    startDate: '',
    endDate: '',
    status: '',
    staff: {
      documentId: '',
      email: '',
      name: '',
      birthdate: '',
      roles: '',
      profilePicture: '',
    },
  };

  const formRef = useRef<HTMLFormElement | null>(null);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState<MaintenanceSchedule>(initialMaintenanceSchedule);
  const [selectedType, setSelectedType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [staffOptions, setStaffOptions] = useState<User[]>([])


  useEffect(() => {
    const fetchStaff = async () => {
      const staffList = await getMaintenanceStaff();
      setStaffOptions(staffList);
    };

    fetchStaff();
  }, []);

  const equipmentOptions = {
    'Ground Support Equipment': [
      'Aircraft tow tractors',
      'Baggage conveyors',
      'Belt loaders',
      'Ground power units',
      'Air start units',
      'Fuel trucks',
      'De-icing vehicles',
    ],
    'Terminal Equipment': [
      'Escalators and elevators',
      'Moving walkways',
      'Baggage carousel systems',
      'Security screening equipment (X-ray machines, metal detectors)',
      'Air conditioning and heating systems',
      'Information displays and PA systems',
    ],
    'Runway and Taxiway Equipment': [
      'Runway lighting systems',
      'Taxiway lighting systems',
      'Windsocks and weather monitoring equipment',
      'Ground radar systems',
    ],
    'Aircraft Maintenance Equipment': [
      'Hydraulic jacks and lifts',
      'Ground support equipment tooling',
      'Maintenance platforms and dockings',
      'Aircraft ladders and stairs',
    ],
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setMaintenanceSchedule((e) => ({
      ...e,
      type: event.target.value,
    }));
  };

  const handleEquipmentChange = (event) => {
    setMaintenanceSchedule((e) => ({
      ...e,
      equipment: event.target.value,
    }));
  };

  const getMaintenanceStaff = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));

      const staffList = querySnapshot.docs
        .filter((doc) => doc.data().roles === 'Maintenance Staff')
        .map((doc) => {
          const data = doc.data();
          return {
            documentId: doc.id,
            email: data.email,
            name: data.name,
            birthdate: data.birthdate,
            roles: data.roles,
            profilePicture: data.profilePicture,
          };
        });

      return staffList;
    } catch (error) {
      return [];
    }
  };

  const areSchedulesOverlapping = (schedule1, schedule2) => {
    const startDate1 = new Date(schedule1.startDate);
    const endDate1 = new Date(schedule1.endDate);
    const startDate2 = new Date(schedule2.startDate);
    const endDate2 = new Date(schedule2.endDate);

    return (
      (startDate1 <= startDate2 && startDate2 <= endDate1) ||
      (startDate1 <= endDate2 && endDate2 <= endDate1) ||
      (startDate2 <= startDate1 && startDate1 <= endDate2) ||
      (startDate2 <= endDate1 && endDate1 <= endDate2)
    );
  };

  const handleMaintenanceSchedule = async (e) => {
    e.preventDefault();
    const existingSchedulesSnapshot = await getDocs(maintenanceScheduleCollection);
    const existingSchedules = existingSchedulesSnapshot.docs.map((doc) => doc.data());

    const schedulesSpesificStaff = existingSchedules.filter(
      (schedule) => schedule.staff.documentId === maintenanceSchedule.staff.documentId
    );

    if (!maintenanceSchedule.type || !maintenanceSchedule.equipment || !maintenanceSchedule.startDate || !maintenanceSchedule.endDate || !maintenanceSchedule.staff.documentId) {
      setError('Please fill in all fields.');
      return;
    }

    if (new Date(maintenanceSchedule.startDate) > new Date(maintenanceSchedule.endDate)) {
      setError('Start date cannot exceed end date.');
      return;
    }

    const overlappingSchedule = schedulesSpesificStaff.find((schedule) =>
      areSchedulesOverlapping(schedule, maintenanceSchedule)
    );

    if (overlappingSchedule) {
      setError('The selected staff has an overlapping schedule.');
      return;
    }

    try {
      await addDoc(maintenanceScheduleCollection, {
        type: maintenanceSchedule.type,
        equipment: maintenanceSchedule.equipment,
        startDate: maintenanceSchedule.startDate,
        endDate: maintenanceSchedule.endDate,
        status: 'Scheduled Maintenance',
        staff: {
          name: maintenanceSchedule.staff.name,
          documentId: maintenanceSchedule.staff.documentId,
        },
      });
        toast.success('🛠️ Maintenance Schedule added!', {
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
      setMaintenanceSchedule(initialMaintenanceSchedule);
      setError('');
  };

  const handleStaffChange = (event) => {
    const selectedStaff = staffOptions.find((staff) => staff.documentId === event.target.value);
    setMaintenanceSchedule((prevSchedule) => ({
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

  return (
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8">Insert Maintenance Schedule</h1>
      <form ref={formRef} action="" onSubmit={handleMaintenanceSchedule} className="bg-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-600">
            Select Type:
          </label>
          <select
            id="type"
            name="type"
            value={maintenanceSchedule.type}
            onChange={handleTypeChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
          >
            <option value="">Select Type</option>
            <option value="Ground Support Equipment">Ground Support Equipment</option>
            <option value="Terminal Equipment">Terminal Equipment</option>
            <option value="Runway and Taxiway Equipment">Runway and Taxiway Equipment</option>
            <option value="Aircraft Maintenance Equipment">Aircraft Maintenance Equipment</option>
          </select>
        </div>
        {selectedType && (
          <div className="mb-4">
            <label htmlFor="equipment" className="block text-sm font-medium text-gray-600">
              Select Equipment:
            </label>
            <select
              id="equipment"
              name="equipment"
              value={maintenanceSchedule.equipment}
              onChange={handleEquipmentChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
            >
              <option value="">Select Equipment</option>
              {equipmentOptions[selectedType].map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-600">
            Start Date and Time:
          </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={maintenanceSchedule.startDate}
            onChange={(e) => setMaintenanceSchedule((prevSchedule) => ({ ...prevSchedule, startDate: e.target.value }))}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-600">
            End Date and Time:
          </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={maintenanceSchedule.endDate}
            onChange={(e) => setMaintenanceSchedule((prevSchedule) => ({ ...prevSchedule, endDate: e.target.value }))}
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
            value={maintenanceSchedule.staff.documentId}
            onChange={handleStaffChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
          >
            <option value="">Select Staff</option>
            {staffOptions.map((staff) => (
              <option key={staff.documentId} value={staff.documentId}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col justify-center text-center">
          <p className="pt-2 font-bold text-red-400 mb-3">{error}</p>
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

export default MaintenanceScheduleForm;
