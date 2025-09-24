export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  emailAddress: string;
  phoneNumber?: string;
  departmentId?: string;
  roleId?: string;
  isActive?: boolean;
  username?: string;
}

export interface EditRequestWrapper {
  editRequest: {
    userId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    departmentId: string;
    roleId: string;
    isActive: boolean;
  };
}
export interface UserApiResponse {
  success: boolean;
  message: string;
  data: boolean;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
  data: boolean;
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
  id: string;
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
