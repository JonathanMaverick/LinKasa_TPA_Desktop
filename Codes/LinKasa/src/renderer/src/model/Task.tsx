import User from './User';  

interface Task {
  id: string;
  name : string;
  deadlineDate: string;
  location: string;
  staff : User;
}

export default Task;
