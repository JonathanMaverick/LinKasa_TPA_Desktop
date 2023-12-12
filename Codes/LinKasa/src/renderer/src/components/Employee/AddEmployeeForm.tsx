import { doc, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, storage } from "../../config/firebase";
import { ref , uploadBytes , getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import User from "@renderer/model/User";
import { useUserAuth } from "@renderer/library/UserAuthContext";
import { userCollection } from "@renderer/library/Collection";

function addEmployeeForm(){

  const initialEmployee : User = {
    documentId: '',
    email: '',
    name: '',
    birthdate: '',
    roles: '',
    profilePicture: '',
    department: '',
  }

  const [employee, setEmployee] = useState<User>(initialEmployee);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [maxDate, setMaxDate] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const roles = [
    "Customer Service Manager",
    "Information Desk Staff",
    "Lost and Found Staff",
    "Check-in Staff",
    "Gate Agents",
    "Airport Operations Manager",
    "Flight Operations Manager",
    "Ground Handling Manager",
    "Ground Handling Staff",
    "Landside Operations Manager",
    "Landside Operations Staff",
    "Maintenance Manager",
    "Maintenance Staff",
    "Customs and Border Control Officers",
    "Baggage Security Supervisor",
    "Baggage Handling Staff",
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

  const {logout} = useUserAuth();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMaxDate(today);
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(password);

  const handleEmployee = async (e) => {
    e.preventDefault();

    if (!employee.email || !password || !employee.name || !employee.roles || !profilePicture || !employee.birthdate) {
      setError('Please fill all the fields');
      return;
    }

    if(validateEmail(employee.email) === false){
      setError('Please insert a valid email');
      return;
    }

    if(validatePassword(password) === false){
      setError('Password must contain at least 6 characters and 1 number');
      return;
    }

    if (employee.roles === "Customer Service Manager"
    || employee.roles === "Information Desk Staff"
    || employee.roles === "Lost and Found Staff"
    || employee.roles === "Check-in Staff"
    || employee.roles === "Gate Agents") {
      employee.department = "Customer Service and Passenger Assistance";
    }
    else if (employee.roles === "Airport Operations Manager"
    || employee.roles === "Flight Operations Manager"
    || employee.roles === "Ground Handling Manager"
    || employee.roles == "Ground Handling Staff"
    || employee.roles === "Landside Operations Manager"
    || employee.roles === "Landside Operations Staff"
    || employee.roles === "Maintenance Manager"
    || employee.roles === "Maintenance Staff") {
      employee.department  = "Operations and Coordination";
    } else if (employee.roles === "Customs and Border Control Officers"
    || employee.roles === "Baggage Security Supervisor"
    || employee.roles === "Baggage Handling Staff") {
      employee.department = "Security and Safety";
    } else if (employee.roles === "Cargo Manager"
    || employee.roles === "Fuel Manager"
    || employee.roles === "Logistic Manager"
    || employee.roles === "Cargo Handlers"){
      employee.department = "Logistics, Cargo, and Supply Chain";
    } else if(employee.roles === "Civil Engineering Manager"){
      employee.department = "Engineering and Maintenance";
    } else if (employee.roles === "Airport Director/CEO"
    || employee.roles === "Chief Financial Officer (CFO)"
    || employee.roles === "Chief Operation Officer (COO)"
    || employee.roles === "Chief Security Officer (CSO)"
    || employee.roles === "Human Resources Director"){
      employee.department = "Executive Level";
    }

    try{
      const newUser = await createUserWithEmailAndPassword(auth, employee.email, password);
      const imageRef = ref(storage, `profile/${profilePicture.name}`);
      await uploadBytes(imageRef, profilePicture);
      const url = await getDownloadURL(imageRef);

      const userDocRef = doc(userCollection, newUser.user.uid);

      await setDoc(userDocRef, {
        name: employee.name,
        email: employee.email,
        roles: employee.roles,
        profilePicture: url,
        birthdate: employee.birthdate,
        department : employee.department
      });

      setEmployee(initialEmployee);
      setProfilePicture(null);
      setError('');
      logout();
    }catch{
      setError('Email already registered');
      return;
    }

  }

  return (
    <>
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
      <h1 className="text-3xl font-bold">Add Employee</h1>
      <form action="" onSubmit={handleEmployee} className="flex flex-col mt-5 w-6/12 gap-2">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        placeholder='Please insert employee email'
        className="border p-2 rounded-lg focus:outline-none"
        type="text"
        value={employee.email}
        onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
        />
      <label htmlFor="name">Name</label>
      <input id="name"
          placeholder='Please insert employee name'
          className="border p-2 rounded-lg focus:outline-none"
          type="text"
          value={employee.name}
          onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
          />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        placeholder='Please insert employee password'
        type="password"
        className="border p-2 rounded-lg focus:outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
      <label htmlFor="birthdate">Birthdate</label>
      <input
        id="birthdate"
        type="date"
        className="border p-2 rounded-lg focus:outline-none"
        max={maxDate}
        value={employee.birthdate}
        onChange={(e) => setEmployee({ ...employee, birthdate: e.target.value })}
        />
      <label htmlFor="roles">Roles</label>
      <select
          id="roles"
          className="border p-2 rounded-lg focus:outline-none"
          value={employee.roles}
          onChange={(e) => setEmployee({ ...employee, roles: e.target.value })}
          >
          <option value="">Select a role</option>
          {roles.map((role, index) => (
            <option key={index} value={role}>{role}</option>
            ))}
        </select>
        <label htmlFor="profile">Profile Picture</label>
        <input
          id="profile"
          type="file"
          accept=".jpg, .jpeg, .png"
          className="p-2"
          onChange={(e) => {
            setProfilePicture(e.target.files && e.target.files[0]);
          }}
          />
      <p className="pt-2 font-bold text-red-400">{error}</p>
      <button type="submit" className="p-2 my-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Add Employee </button>
      </form>
    </div>
    </>
  )
}

export default addEmployeeForm;
