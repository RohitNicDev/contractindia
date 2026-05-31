import api from "./apiInterceptor";

export const authentication = async (payload) => {
  return await api.post("/Authentication/authenticate", payload);
};

export const saveUserRegistration = async (payload) => {
  return await api.post("/UserRegistration/save", payload);
};

export const verifyEmail = async (payload) => {
  return await api.post("/UserRegistration/verify/email",payload);
};

export const verifyMobile = async (payload) => {
  return await api.post("/UserRegistration/verify/mobile",payload);
};

export const setPassword = async (payload) => {
  return await api.post("/UserRegistration/password",payload);
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
