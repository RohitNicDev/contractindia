import api from "./apiInterceptor";

export const authentication = async (payload) => {
  return await api.post("/Authentication/authenticate", payload);
};
export const userType = async () => {
  return await api.get(`/Common/commonlist/userType`);
};

export const saveUserRegistration = async (payload) => {
  return await api.post("/UserRegistration/save", payload);
};

export const verifyEmail = async (payload) => {
  return await api.post("/UserRegistration/verify/email", payload);
};

export const verifyMobile = async (payload) => {
  return await api.post("/UserRegistration/verify/mobile", payload);
};

export const setPassword = async (payload) => {
  return await api.post("/UserRegistration/userpassword", payload);
};

export const resendOtp = async (payload) => {
  const { type, id } = payload;
  const endpoint =
    type === "email"
      ? "/UserRegistration/otp/resend/email"
      : "/UserRegistration/otp/resend/mobile";
  return await api.post(endpoint, { id: id });
};

export const getState = async (payload) => {
  return await api.get("/Common/getstate/2");
};
export const getCities = async (StateId) => {
  return await api.get(`/Common/getcity/${StateId}`);
};
export const planMasterSave = async (payload) => {
  return await api.post(`/PlanMaster/save`, payload);
};
export const planMasterUpdate = async (payload) => {
  return await api.put(`/PlanMaster/update`, payload);
};
export const planMasterDelete = async (planId) => {
  return await api.delete(`/PlanMaster/delete/${planId}`);
};
export const planMasterGet = async () => {
  return await api.get(`/PlanMaster/get`);
};
export const planMasterGetById = async (planId) => {
  return await api.get(`/PlanMaster/get/${planId}`);
};
export const DocumentCategorySave = async (payload) => {
  return await api.post(`/DocumentCategory/save`, payload);
};
export const DocumentCategoryUpdate = async (payload) => {
  return await api.put(`/DocumentCategory/update`, payload);
};
export const DocumentCategoryDelete = async (planId) => {
  return await api.delete(`/DocumentCategory/delete/${planId}`);
};
export const DocumentCategoryGet = async () => {
  return await api.get(`/DocumentCategory/get`);
};
export const DocumentCategoryGetById = async (planId) => {
  return await api.get(`/DocumentCategory/get/${planId}`);
};
export const UserDocumentStoreSave = async (payload) => {
  return await api.post(`/UserDocumentStore/save`, payload);
};
export const UserDocumentStoreUpdate = async (payload) => {
  return await api.put(`/UserDocumentStore/update`, payload);
};
export const UserDocumentStoreDelete = async (planId) => {
  return await api.delete(`/UserDocumentStore/delete/${planId}`);
};
export const UserDocumentStoreGet = async () => {
  return await api.get(`/UserDocumentStore/get`);
};
export const UserDocumentStoreGetById = async (planId) => {
  return await api.get(`/UserDocumentStore/get?${planId}`);
};
export const DocumentSubCategorySave = async (payload) => {
  return await api.post(`/DocumentSubCategory/save`, payload);
};
export const DocumentSubCategoryUpdate = async (payload) => {
  return await api.put(`/DocumentSubCategory/update`, payload);
};
export const DocumentSubCategoryDelete = async (planId) => {
  return await api.delete(`/DocumentSubCategory/delete/${planId}`);
};
export const DocumentSubCategoryGet = async () => {
  return await api.get(`/DocumentSubCategory/get`);
};
export const DocumentSubCategoryGetById = async (planId) => {
  return await api.get(`/DocumentSubCategory/get/${planId}`);
};
export const ServiceMasterSave = async (payload) => {
  return await api.post(`/ServiceMaster/save`, payload);
};
export const ServiceMasterUpdate = async (payload) => {
  return await api.put(`/ServiceMaster/update`, payload);
};
export const ServiceMasterDelete = async (planId) => {
  return await api.delete(`/ServiceMaster/delete/${planId}`);
};
export const ServiceMasterGet = async () => {
  return await api.get(`/ServiceMaster/get`);
};
export const ServiceRootGet = async () => {
  return await api.get(`/ServiceMaster/rootservice`);
};
export const ServiceMasterGetById = async (serviceId) => {
  return await api.get(`/ServiceMaster/get?ParentServiceID=${serviceId}`);
};
export const subscriptionHistoryGet = async () => {
  return await api.get(`/UserSubscriptionDetail/get`);
};
export const userSubscriptionDetailSave = async (payload) => {
  return await api.post(`/UserSubscriptionDetail/save`, payload);
};
export const clientHistoryGet = async () => {
  return await api.get(`/ClientMaster/get`);
};

export const leadSave = async (payload) => {
  return await api.post(`/LeadMaster/save`, payload);
};
export const leadUpdate = async (payload) => {
  return await api.put(`/LeadMaster/update`, payload);
};
export const leadDelete = async (leadId) => {
  return await api.delete(`/LeadMaster/delete/${leadId}`);
};
export const leadGet = async () => {
  return await api.get(`/LeadMaster/get`);
};
export const UserVerificationGet = async (type, usertype) => {
  const params = new URLSearchParams();

  // Only append if 'type' is provided and not null/undefined
  if (type !== undefined && type !== null && type !== "") {
    params.append("isVerifiedByAdmin", type);
  }

  // Only append if 'usertype' is provided and not null/undefined
  if (usertype !== undefined && usertype !== null && usertype !== "") {
    params.append("userType", usertype);
  }

  // Convert params to string (e.g., "isVerifiedByAdmin=true&userType=2")
  const queryString = params.toString();

  // Append the query string to the base endpoint if any parameters exist
  const url = queryString
    ? `/UserRegistration/get?${queryString}`
    : `/UserRegistration/get`;

  return await api.get(url);
};
export const verifyUserRegistration = async (payload) => {
  return await api.post(`/UserRegistration/verify/admin`, payload);
};
export const userBasicInformationSave = async (payload) => {
  return await api.post("/UserBasicInformation/save", payload);
};
export const userBasicInformationUpdate = async (payload) => {
  return await api.put("/UserBasicInformation/Update", payload);
};
export const userBasicInformationbyParam = async (params) => {
  return await api.get(`/UserBasicInformation/get?${params}` );
};

export const userBankDetailSave = async (payload) => {
  return await api.post("/UserBankDetail/save", payload);
};
export const userBankDetailbyParams = async (Params) => {
  return await api.get(`/UserBankDetail/get?${Params}`);
};
export const ContractorListGet = async (serviceId) => {
  const response = await api.get(
    `/UserRegistration/get?isVerifiedByAdmin=1&userType=2&serviceId=${serviceId}`,
  );

  if (!response?.status) {
    throw new Error(response?.message || "Contractors API error");
  }

  return response?.data || [];
};
export const UserRegistrationUserIdGet = async (userId) => {
  return await api.get(`/UserRegistration/get?userId=${userId}`);
};

export const userCommonlistType = async (commenlist) => {
  return await api.get(`/Common/commonlist/${commenlist}`);
};
