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
  // emailHod: string;
}

export interface DepartmentApiResponse {
  success: boolean;
  message: string;
  data: companyDepartment[];
}

export interface DepartmentByIdApiResponse {
  success: boolean;
  message: string;
  data: companyDepartment;
}

export interface CompanyUsersApiResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface DeleteCompanyResponse {
  success: boolean;
  message: string;
  data: boolean;
}

export interface DeleteRoleResponse {
  success: boolean;
  message: string;
  data: boolean;
}

export interface companyRole {
  roleId: string;
  roleName: string;
  roleDescription: string;
  permissions: [];
}

export interface RoleApiResponse {
  success: boolean;
  message: string;
  data: companyRole[];
}

export interface UserIntegrations {
  isSlackConnected: boolean;
  isTeamsConnected: boolean;
  isOutlookConnected: boolean;
  isSeamlessHRConnected: boolean;
  isJiraConnected: boolean;
  isPlannerConnected: boolean;
}
