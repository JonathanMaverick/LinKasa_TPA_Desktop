interface UserContextType {
  username: string;
  errorMessage: string;
  roles: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export default UserContextType
