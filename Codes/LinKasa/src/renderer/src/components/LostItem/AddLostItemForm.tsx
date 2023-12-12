import { storage } from "@renderer/config/firebase";
import LostAndFound from "@renderer/model/LostAndFound";
import { lostAndFoundCollection } from "../../library/Collection";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddLostItemForm(){

  const initialLostItem : LostAndFound = {
    id : '',
    overview : '',
    description: '',
    photoUrl: '',
    status : '',
  }

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [lostItem, setLostItem] = useState<LostAndFound>(initialLostItem);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handeLostItem = async (e) => {
    e.preventDefault();
    if(!photoFile || !lostItem.description){
     setError('Please fill all the fields');
      return;
    }

    const imageRef = ref(storage, `lostItem/${photoFile.name}`);
    await uploadBytes(imageRef, photoFile);
    const url = await getDownloadURL(imageRef);

    try{
      await addDoc(lostAndFoundCollection, {
        overview : lostItem.overview,
        description : lostItem.description,
        photoUrl : url,
        status : 'unclaimed'
      });
      toast.success('🧢 Lost item added!', {
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
      setError('Failed to add lost item');
    }

    if (formRef.current) {
      formRef.current.reset();
    }
    setLostItem(initialLostItem);
    setPhotoFile(null);
    setPhotoPreview(null);
    setError('');
  }

  const handleImagePreview = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
  <>
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
    <h1 className="text-3xl font-bold">Add Lost Item</h1>
    {photoPreview && (
      <img
        src={photoPreview}
        alt="Preview"
        className="mt-2 max-w-xs"
      />
    )}
    <form ref={formRef} onSubmit={handeLostItem} className="flex flex-col mt-5 w-6/12 gap-2">
    <label htmlFor="item">Lost Item</label>
      <input
        id="item"
        type="file"
        accept=".jpg, .jpeg, .png"
        className="p-2"
        onChange={handleImagePreview}
        />
      <label htmlFor="overview">Overview</label>
      <input id="overview"
          className="border p-2 rounded-lg focus:outline-none"
          type="text"
          value={lostItem.overview}
          onChange={(e) => setLostItem({ ...lostItem, overview: e.target.value })}
          />
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        rows={6}
        className="border p-2 rounded-lg focus:outline-none resize-none"
        value={lostItem.description}
        onChange={(e) => {
          setLostItem({...lostItem, description : e.target.value});
        }}
      ></textarea>
    <p className="pt-2 font-bold text-red-400">{error}</p>
    <button type="submit" className="p-2 my-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Add Lost Data </button>
    </form>
    <ToastContainer />
  </div>
  </>
  )
}

export default AddLostItemForm;
