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

export interface companyDepartment {
  id: string;
  departmentName: string;
  hodName: string;
  emailHod: string;
}

export interface companyRole {
  id: string;
  roleName: string;
  description: string;
  permissions: string[];
}
