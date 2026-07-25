import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialStoreState = {
  companyType: "",
  companyTypeName: "",
  basicInfo: {
    companyName: "",
    contactPerson: "",
    email: "",
    mobile: "",
    address: "",
    pinCode: "",
    companyPhotos: [],
    emailVerified: false,
    mobileVerified: false,
    password: "",
  },
  registrationDetails: {
    gstNo: "",
    panNo: "",
    cinNo: "",
    aadharNo: "",
    pfNo: "",
    esiNo: "",
    msmeNo: "",
    udyogAadhaarToggle: false,
    importExportCertFiles: [],
  },
  bankingDetails: {
    bankName: "",
    accountType: "",
    accountNumber: "",
    ifscCode: "",
    micrCode: "",
  },
  documents: {
    businessRegistration: [],
    identityAddress: [],
    complianceCertificates: [],
    otherDocuments: [],
  },
  services: [],
  currentStep: 1,
  isSkipped: false,
};

export const useProfileWizardStore = create()(
  persist(
    (set) => ({
      ...initialStoreState,

      setCompanyType: (payload) =>
        set((state) => ({
          companyType: payload?.companyType ?? payload,
          companyTypeName: payload?.companyTypeName ?? state.companyTypeName,
        })),

      setBasicInfo: (info) =>
        set((state) => ({
          basicInfo: { ...state.basicInfo, ...info },
        })),

      setRegistrationDetails: (details) =>
        set((state) => ({
          registrationDetails: { ...state.registrationDetails, ...details },
        })),

      setBankingDetails: (details) =>
        set((state) => ({
          bankingDetails: { ...state.bankingDetails, ...details },
        })),

      setDocuments: (category, sections) =>
        set((state) => ({
          documents: {
            ...state.documents,
            [category]: sections,
          },
        })),

      addService: (service) =>
        set((state) => ({
          services: [
            ...state.services,
            { ...service, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),

      removeService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      updateServiceOrder: (services) => set({ services }),

      setCurrentStep: (step) => set({ currentStep: step }),

      setIsSkipped: (skipped) => set({ isSkipped: skipped }),

      resetStore: () => set({ ...initialStoreState }),
    }),
    {
      name: "contracts_india_profile_wizard_draft_v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Helper function to calculate completion percentage dynamically
export const calculateProgress = (state) => {
  let completed = 0;
  let total = 0;

  const check = (value) => {
    total++;
    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      completed++;
    }
  };

  // Company Type
  check(state.companyType);

  // Basic Info
  const bi = state.basicInfo;
  check(bi.companyName?.trim());
  check(bi.contactPerson?.trim());
  check(bi.email?.trim());
  check(bi.mobile?.trim());
  check(bi.address?.trim());
  check(bi.pinCode?.trim());

  // Registration
  const rd = state.registrationDetails;
  check(rd.gstNo?.trim());
  check(rd.panNo?.trim());
  check(rd.cinNo?.trim());
  check(rd.aadharNo?.trim());
  check(rd.pfNo?.trim());
  check(rd.esiNo?.trim());
  check(rd.msmeNo?.trim());
  check(rd.importExportCertFiles);

  // Banking
  const bd = state.bankingDetails;
  check(bd.bankName?.trim());
  check(bd.accountType?.trim());
  check(bd.accountNumber?.trim());
  check(bd.ifscCode?.trim());

  // Documents
  const docs = state.documents;

  const hasFiles = (sections = []) =>
    sections.some((section) => section?.files?.length > 0);

  check(hasFiles(docs.businessRegistration));
  check(hasFiles(docs.identityAddress));
  check(hasFiles(docs.complianceCertificates));
  check(hasFiles(docs.otherDocuments));

  // Services
  check(state.services?.length > 0);

  return Math.round((completed / total) * 100);
};

// Suggestions helper based on incomplete details
export const getProfileSuggestions = (state) => {
  const suggestions = [];

  if (!state.companyType) {
    suggestions.push("Select your Organisation Structure");
  }
  const bi = state.basicInfo;
  if (
    !bi.companyName ||
    !bi.contactPerson ||
    !bi.email ||
    !bi.mobile ||
    !bi.address ||
    !bi.pinCode
  ) {
    suggestions.push("Complete all fields in Basic Company Information");
  }
  const rd = state.registrationDetails;
  if (!rd.gstNo || !rd.panNo || !rd.cinNo) {
    suggestions.push("Provide GST, PAN, and CIN registration details");
  }
  const bd = state.bankingDetails;
  if (!bd.bankName || !bd.accountNumber || !bd.ifscCode) {
    suggestions.push("Add bank name, account number, and IFSC code");
  }
  const docs = state.documents;
  const totalUploaded =
    docs.businessRegistration.length +
    docs.identityAddress.length +
    docs.complianceCertificates.length +
    docs.otherDocuments.length;
  if (totalUploaded === 0) {
    suggestions.push("Upload business registration or identity documents");
  }
  if (state.services.length === 0) {
    suggestions.push(
      "List at least one service to start receiving tender recommendations",
    );
  }

  return suggestions;
};
