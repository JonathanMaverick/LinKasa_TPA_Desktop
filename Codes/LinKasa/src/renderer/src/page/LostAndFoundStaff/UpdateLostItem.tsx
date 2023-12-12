import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '@renderer/config/firebase';
import { useParams } from 'react-router-dom';
import SideBar from '@renderer/components/SideBar';
import LostAndFound from '@renderer/model/LostAndFound';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function UpdateLostItem() {

  const initialLostItem : LostAndFound = {
    id : '',
    overview : '',
    description: '',
    photoUrl: '',
    status : '',
  }

  const { lostItemId } = useParams();
  const [lostItem, setLostItem] = useState<LostAndFound>(initialLostItem);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (lostItemId) {
          const lostItemDocRef = doc(db, 'LostAndFound', lostItemId);
          const lostItemDocSnapshot = await getDoc(lostItemDocRef);

          if (lostItemDocSnapshot.exists()) {
            const lostItemData = lostItemDocSnapshot.data() as LostAndFound;
            setLostItem(lostItemData);

            if (lostItemData.photoUrl) {
              setPhotoPreview(lostItemData.photoUrl);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [lostItemId]);

  const handleUpdateLostItem = async (e) => {
    e.preventDefault();
    if (!lostItemId) return;

    if (!lostItem.overview || !lostItem.description) {
      setError('Please fill all the fields');
      return;
    }

    try {
      if (photoFile) {
        const imageRef = ref(storage, `lostItem/${photoFile.name}`);
        await uploadBytes(imageRef, photoFile);
        const url = await getDownloadURL(imageRef);

        const lostItemDocRef = doc(db, 'LostAndFound', lostItemId);
        await setDoc(lostItemDocRef, {
          overview: lostItem.overview,
          description: lostItem.description,
          photoUrl: url,
          status: lostItem.status,
        });
      } else {
        const lostItemDocRef = doc(db, 'LostAndFound', lostItemId);
        await setDoc(lostItemDocRef, {
          overview: lostItem.overview,
          description: lostItem.description,
          status: lostItem.status,
        });
      }

      toast.success('🧢 Lost item updated!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (error) {
      setError('Error updating lost and found schedule');
    }

    setError(null);
  };

  const handleImagePreview = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
    <div className="flex bg-sky-200 h-screen">
    <SideBar />
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
    <h1 className="text-3xl font-bold">Update Lost Item</h1>
    {photoPreview && (
      <img
        src={photoPreview}
        alt="Preview"
        className="mt-2 max-w-xs"
      />
    )}
    <form onSubmit={handleUpdateLostItem} className="flex flex-col mt-5 w-6/12 gap-2">
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
      <label htmlFor="status">
        Status:
      </label>
      <select
        id="status"
        name="status"
        value={lostItem.status || ''}
        onChange={(e) => setLostItem({ ...lostItem, status: e.target.value })}
        className="border p-2 rounded-lg focus:outline-none"
      >
        <option value="">Select Status</option>
        <option value="returned to owner">Returned To Owner</option>
        <option value="unclaimed">Unclaimed</option>
      </select>
    <p className="pt-2 font-bold text-red-400">{error}</p>
    <button type="submit" className="p-2 my-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Update Lost Data </button>
    </form>
    <ToastContainer />
  </div>
  </div>
  </>
  );
}

export default UpdateLostItem;
