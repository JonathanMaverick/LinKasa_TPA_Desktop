import { doc, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { auth, storage } from "../../config/firebase";
import { ref , uploadBytes , getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword } from "firebase/auth";
import User from "@renderer/model/User";
import { useUserAuth } from "@renderer/library/UserAuthContext";
import { userCollection } from "@renderer/library/Collection";
import { Link } from "react-router-dom";

function RegisterForm(){

  const initialPassenger : User = {
    documentId: '',
    email: '',
    name: '',
    birthdate: '',
    roles: '',
    profilePicture: '',
  }

  const [passenger, setPassenger] = useState<User>(initialPassenger);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [maxDate, setMaxDate] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const {logout} = useUserAuth();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMaxDate(today);
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(password);

  const handleUser = async (e) => {
    e.preventDefault();

    if (!passenger.email || !password || !passenger.name || !profilePicture || !passenger.birthdate) {
      setError('Please fill all the fields');
      return;
    }

    if(validateEmail(passenger.email) === false){
      setError('Please insert a valid email');
      return;
    }

    if(validatePassword(password) === false){
      setError('Password must contain at least 6 characters and 1 number');
      return;
    }

    try{
      const newUser = await createUserWithEmailAndPassword(auth, passenger.email, password);
      const imageRef = ref(storage, `profile/${profilePicture.name}`);
      await uploadBytes(imageRef, profilePicture);
      const url = await getDownloadURL(imageRef);

      const passengerDocRef = doc(userCollection, newUser.user.uid);

      await setDoc(passengerDocRef, {
        name: passenger.name,
        email: passenger.email,
        profilePicture: url,
        roles : 'Passenger',
        birthdate: passenger.birthdate
      });

      setPassenger(initialPassenger);
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
    <div className="bg-sky-200 flex flex-col justify-center items-center w-full mb-20">
      <form action="" onSubmit={handleUser} className="flex flex-col mt-5 w-6/12 gap-2">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        placeholder='Please insert employee email'
        className="border p-2 rounded-lg focus:outline-none"
        type="text"
        value={passenger.email}
        onChange={(e) => setPassenger({ ...passenger, email: e.target.value })}
        />
      <label htmlFor="name">Name</label>
      <input id="name"
          placeholder='Please insert employee name'
          className="border p-2 rounded-lg focus:outline-none"
          type="text"
          value={passenger.name}
          onChange={(e) => setPassenger({ ...passenger, name: e.target.value })}
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
        value={passenger.birthdate}
        onChange={(e) => setPassenger({ ...passenger, birthdate: e.target.value })}
        />
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
      <button type="submit" className="p-2 my-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Register </button>
      </form>
      <Link to="/">
        <p className="text-blue-500 mt-3 underline">Already Have an Account? Login Here!</p>
      </Link>
    </div>
    </>
  )
}

export default RegisterForm;
