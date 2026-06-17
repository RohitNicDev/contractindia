import {
  ChevronLeft,
  ChevronRight,
  Loader,
  Upload,
  FileText,
  AlertCircle,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUserStore } from "../../../../store/store";
import {
  DocumentCategoryGet,
  DocumentSubCategoryGet,
  UserDocumentStoreSave,
} from "../../../../services/api";
import { createDocumentPayload } from "../../../../utils/Format";

export function Step4Documents({ store, nextStep, prevStep }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState({});
  const { loginResponce } = useUserStore();

  // ✅ Fetch document categories
  const { data: categoriesData = { data: [] }, isLoading: categoriesLoading } =
    useQuery({
      queryKey: ["documentCategories"],
      queryFn: DocumentCategoryGet,
      staleTime: Infinity,
    });

  const categories = (categoriesData?.data || []).filter(
    (cat) => cat?.IsActive === true || cat?.IsActive === 1,
  );

  // ✅ Fetch ALL subcategories (not filtered by category)
  const {
    data: allSubcategoriesData = { data: [] },
    isLoading: subcategoriesLoading,
  } = useQuery({
    queryKey: ["documentSubCategories"],
    queryFn: DocumentSubCategoryGet,
    enabled: categories.length > 0,
    staleTime: Infinity,
  });

  // ✅ Filter subcategories by DocumentCategoryID
  const subcategoriesByCategory = useMemo(() => {
    const allSubs = allSubcategoriesData?.data || [];
    const grouped = {};

    categories.forEach((cat) => {
      const catId = cat?.DocumentCategoryID;
      // ✅ Filter subcategories by DocumentCategoryID
      grouped[catId] = allSubs.filter(
        (sub) =>
          sub?.DocumentCategoryID === catId &&
          (sub?.IsActive === true || sub?.IsActive === 1),
      );
    });

    return grouped;
  }, [allSubcategoriesData, categories]);

  console.log("Categories:", categories);
  console.log("All Subcategories:", allSubcategoriesData?.data);
  console.log("Grouped Subcategories:", subcategoriesByCategory);

  // ✅ Mutation for saving documents
  const { mutate: saveDocument, isPending: isSavingDoc } = useMutation({
    mutationFn: UserDocumentStoreSave,
    onSuccess: (response) => {
      if (response?.status) {
        toast.success("Document uploaded successfully!");
      } else {
        toast.error(response?.message || "Failed to upload document");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to upload document");
    },
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e, categoryId, subcategoryId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFileUpload(files, categoryId, subcategoryId);
    }
  };

  const handleFileUpload = (files, categoryId, subcategoryId) => {
    console.log(files, "files");

    files.forEach(async (file) => {
      console.log("selected", file);

      // ✅ Validate file
      const validation = validateDocumentFile(file, 5, [
        "pdf",
        "jpg",
        "jpeg",
        "png",
        "tiff",
      ]);

      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      const fileKey = `${categoryId}-${subcategoryId}-${file?.name}`;

      // ✅ Set uploading state
      setUploadingFiles((prev) => ({
        ...prev,
        [fileKey]: 0,
      }));

      // ✅ Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        setUploadingFiles((prev) => ({
          ...prev,
          [fileKey]: progress,
        }));
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadingFiles((prev) => {
              const updated = { ...prev };
              delete updated[fileKey];
              return updated;
            });
            setUploadedDocs((prev) => ({
              ...prev,
              [fileKey]: { name: file?.name, size: file?.size },
            }));
          }, 500);
        }
      }, 250);

      // ✅ Format payload
      const payload = await createDocumentPayload({
        file,
        userId: loginResponce?.userId || "",
        categoryId: categoryId,
        subCategoryId: subcategoryId,
        documentType: "",
        documentId: 0,
      });
      console.log(payload, "11112");

      // ✅ Save document
      saveDocument(payload);
    });
  };

  const handleDeleteDocument = (fileKey) => {
    setUploadedDocs((prev) => {
      const updated = { ...prev };
      delete updated[fileKey];
      return updated;
    });
    toast.success("Document removed");
  };

  const isLoading = categoriesLoading || subcategoriesLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-800">
          Upload your commercial validation documents. Upload one document per
          subcategory.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-slate-600">
            Loading categories...
          </span>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex items-center justify-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500">
            No document categories available
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ✅ Iterate through categories */}
          {categories.map((category) => {
            const categoryId = category?.DocumentCategoryID;
            // ✅ Get subcategories filtered by this category's ID
            const subcats = subcategoriesByCategory[categoryId] || [];

            return (
              <motion.div
                key={categoryId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-4 space-y-4"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {category?.DocumentCategoryName || "Unknown Category"}
                    </h3>
                   
                  </div>
                </div>

                {/* Subcategories Grid */}
                {subcats.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No subcategories available for this category
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ✅ Iterate through filtered subcategories */}
                    {subcats.map((subcat) => {
                      const subcategoryId = subcat?.DocumentSubCategoryID;
                      const fileKey = `${categoryId}-${subcategoryId}`;
                      const uploadProgress = uploadingFiles[fileKey];
                      const uploadedDoc = uploadedDocs[fileKey];

                      return (
                        <motion.div
                          key={subcategoryId}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white border border-slate-200 rounded-xl p-4 space-y-3"
                        >
                          {/* Subcategory Title */}
                          <div>
                            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                              {subcat?.DocumentSubCategoryName ||
                                "Unknown Subcategory"}
                            </h5>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              ID: {subcategoryId}
                            </p>
                          </div>

                          {/* Upload Area OR Uploaded Document */}
                          {uploadedDoc ? (
                            // ✅ Show uploaded document
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-green-700 truncate">
                                    {uploadedDoc.name}
                                  </p>
                                  <p className="text-[10px] text-green-600">
                                    {(uploadedDoc.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteDocument(fileKey)}
                                className="flex-shrink-0 p-1 hover:bg-green-100 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4 text-green-600" />
                              </button>
                            </motion.div>
                          ) : (
                            <div
                              onDragEnter={handleDrag}
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={(e) =>
                                handleDrop(e, categoryId, subcategoryId)
                              }
                              className={`relative border border-dashed rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-200 bg-white overflow-hidden ${
                                dragActive
                                  ? "border-blue-500 bg-blue-50 shadow-sm"
                                  : "border-slate-200 hover:border-blue-400 hover:shadow-sm"
                              }`}
                            >
                              <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  if (e.target.files) {
                                    handleFileUpload(
                                      Array.from(e.target.files),
                                      categoryId,
                                      subcategoryId,
                                    );
                                  }
                                }}
                              />

                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                  <Upload className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-700">
                                    Upload Document
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    PDF, JPG, PNG • Max 5MB
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Upload Progress */}
                          <AnimatePresence>
                            {uploadProgress !== undefined && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-1"
                              >
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-slate-600 font-medium">
                                    Uploading...
                                  </span>
                                  <span className="text-purple-600 font-mono font-bold">
                                    {uploadProgress}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                  <motion.div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-between gap-3 pt-6 border-t border-slate-200 mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-all flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={nextStep}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-1"
        >
          Save & Continue <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ✅ Helper function to validate files
function validateDocumentFile(file, maxSizeMB, allowedFormats) {
  const fileSizeMB = file?.size / (1024 * 1024);
  const fileExtension = file?.name.split(".").pop()?.toLowerCase();

  if (!fileExtension || !allowedFormats.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Invalid file format. Allowed: ${allowedFormats.join(", ")}`,
    };
  }

  if (fileSizeMB > maxSizeMB) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit. Your file: ${fileSizeMB.toFixed(2)}MB`,
    };
  }

  return { isValid: true };
}

// ✅ Helper function to format payload
