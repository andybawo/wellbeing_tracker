export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  role: string;
  dateAdded: Date;
  status: 'Active' | 'Inactive';
  profilePicture?: string;
}
