import LostItemList from "@renderer/components/LostItem/LostItemList";
import SideBar from "@renderer/components/SideBar";

function ViewLostItem()
{
  return (
    <>
      <div className='flex bg-sky-200'>
        <SideBar />
        <LostItemList />
      </div>
    </>
  );
}

export default ViewLostItem;
