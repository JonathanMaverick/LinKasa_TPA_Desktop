interface UserContextType {
  username: string;
  errorMessage: string;
  roles: string;
  department: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export default UserContextType
