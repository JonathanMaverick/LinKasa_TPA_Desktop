import User from './User';

interface Task {
  id: string;
  name : string;
  deadlineDate: string;
  startDate: string;
  location: string;
  description: string;
  status : string,
  staff : User;
}

export default Task;
