import SideBar from '../../components/SideBar';
import AddLostItemForm from '../../components/LostItem/AddLostItemForm';

function AddLostItem(){
  return (
    <>
    <div className='flex bg-sky-200 h-screen'>
      <SideBar />
      <AddLostItemForm />
    </div>
    </>
  )
}

export default AddLostItem;
