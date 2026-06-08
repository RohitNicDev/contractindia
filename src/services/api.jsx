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
  const { type, emailId, mobileNo } = payload;
  const endpoint =
    type === "email"
      ? "/UserRegistration/resend/email"
      : "/UserRegistration/resend/mobile";
  const body = type === "email" ? { emailId } : { mobileNo };
  return await api.post(endpoint, body);
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
export const ServiceMasterGetById = async (planId) => {
  return await api.get(`/ServiceMaster/get/${planId}`);
};
export const subscriptionHistoryGet = async () => {
  return await api.get(`/UserSubscriptionDetail/get`);
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
