import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FileItem {
  name: string;
  size: number;
  progress: number;
}

export interface DocumentSection {
  type: string;
  files: FileItem[];
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  tags: string[];
  status: "Active" | "Draft";
}

export interface ProfileWizardState {
  companyType: string;
  basicInfo: {
    companyName: string;
    contactPerson: string;
    email: string;
    mobile: string;
    address: string;
    emailVerified: boolean;
    mobileVerified: boolean;
    password?: string; // Optional field for password setup in the future
    // confirmPassword?: string; // Optional field for password confirmation in the future
  };
  registrationDetails: {
    gstNo: string;
    panNo: string;
    cinNo: string;
    aadharNo: string;
    pfNo: string;
    esiNo: string;
    msmeNo: string;
    udyogAadhaarToggle: boolean;
    importExportCertFiles: FileItem[];
  };
  bankingDetails: {
    bankName: string;
    accountType: string;
    accountNumber: string;
    ifscCode: string;
    micrCode: string;
  };
  documents: {
    businessRegistration: DocumentSection[];
    identityAddress: DocumentSection[];
    complianceCertificates: DocumentSection[];
    otherDocuments: DocumentSection[];
  };
  services: ServiceItem[];
  currentStep: number;
  isSkipped: boolean;

  // Setters
  setCompanyType: (type: string) => void;
  setBasicInfo: (info: Partial<ProfileWizardState["basicInfo"]>) => void;
  setRegistrationDetails: (details: Partial<ProfileWizardState["registrationDetails"]>) => void;
  setBankingDetails: (details: Partial<ProfileWizardState["bankingDetails"]>) => void;
  setDocuments: (category: keyof ProfileWizardState["documents"], sections: DocumentSection[]) => void;
  addService: (service: Omit<ServiceItem, "id">) => void;
  removeService: (id: string) => void;
  updateServiceOrder: (services: ServiceItem[]) => void;
  setCurrentStep: (step: number) => void;
  setIsSkipped: (skipped: boolean) => void;
  resetStore: () => void;
}

const initialStoreState = {
  companyType: "",
  basicInfo: {
    companyName: "",
    contactPerson: "",
    email: "",
    mobile: "",
    address: "",
    emailVerified: false,
    mobileVerified: false,
    password: "",
    // confirmPassword: "",
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

export const useProfileWizardStore = create<ProfileWizardState>()(
  persist(
    (set) => ({
      ...initialStoreState,

      setCompanyType: (type) => set({ companyType: type }),

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
    }
  )
);

// Helper function to calculate completion percentage dynamically
export const calculateProgress = (state: ProfileWizardState): number => {
  let score = 0;

  // Step 1: Company Type (15%)
  if (state.companyType) score += 15;

  // Step 2: Basic Info (15% total, 3% per field)
  const bi = state.basicInfo;
  if (bi.companyName?.trim()) score += 3;
  if (bi.contactPerson?.trim()) score += 3;
  if (bi.email?.trim()) score += 3;
  if (bi.mobile?.trim()) score += 3;
  if (bi.address?.trim()) score += 3;

  // Step 3: Registration & Compliance (15% total, 3% per key field)
  const rd = state.registrationDetails;
  if (rd.gstNo?.trim()) score += 3;
  if (rd.panNo?.trim()) score += 3;
  if (rd.cinNo?.trim()) score += 3;
  if (rd.aadharNo?.trim()) score += 3;
  // If any compliance is filled (PF, ESI, MSME or MSME import certificates)
  if (
    rd.pfNo?.trim() ||
    rd.esiNo?.trim() ||
    rd.msmeNo?.trim() ||
    rd.importExportCertFiles?.length > 0
  ) {
    score += 3;
  }

  // Step 4: Banking Details (15% total, 3% per field)
  const bd = state.bankingDetails;
  if (bd.bankName?.trim()) score += 3;
  if (bd.accountType?.trim()) score += 3;
  if (bd.accountNumber?.trim()) score += 3;
  if (bd.ifscCode?.trim()) score += 3;
  if (bd.micrCode?.trim()) score += 3;

  // Step 5: Document Upload Center (20% total, 5% per section containing files)
  const docs = state.documents;
  const countSecFiles = (sections: DocumentSection[]) =>
    sections.reduce((acc, sec) => acc + (sec.files?.length || 0), 0);

  if (countSecFiles(docs.businessRegistration) > 0) score += 5;
  if (countSecFiles(docs.identityAddress) > 0) score += 5;
  if (countSecFiles(docs.complianceCertificates) > 0) score += 5;
  if (countSecFiles(docs.otherDocuments) > 0) score += 5;

  // Step 6: Service Listing (20% total)
  if (state.services?.length > 0) score += 20;

  return score;
};

// Suggestions helper based on incomplete details
export const getProfileSuggestions = (state: ProfileWizardState): string[] => {
  const suggestions: string[] = [];

  if (!state.companyType) {
    suggestions.push("Select your Organisation Structure");
  }
  const bi = state.basicInfo;
  if (!bi.companyName || !bi.contactPerson || !bi.email || !bi.mobile || !bi.address) {
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
    suggestions.push("List at least one service to start receiving tender recommendations");
  }

  return suggestions;
};
