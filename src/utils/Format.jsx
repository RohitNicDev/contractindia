const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
export const formatDocumentPayload = (
  file,
  documentName,
  categoryId,
  subCategoryId,
  userId,
) => {
  console.log(  userId,
"123"    
  );

  return {
    userDocumentID: 0,
    userId: userId || 0,
    documentName: documentName || file?.name,
    documentCategoryID: categoryId,
    documentCategoryName: "",
    documentSubCategoryID: subCategoryId,
    documentSubCategoryName: "",
    // documentPath: '', // Will be set by backend
    fileExtension: file?.name.split(".").pop(),
    fileSizeKB: Math.round(file?.size / 1024),
    isActive: 1,
  };
};
export const createDocumentPayload = async ({
  file,
  documentId = 0,
  documentType = "",
  documentImageGroup = "",
  userId = 0,
  documentTag = "add",
  stateId = 0,
  isDocumentShared = 0,
  categoryId = 0,
  subCategoryId = 0,
}) => {
  const base64 = await fileToBase64(file);
  console.log(file, "23");
  console.log(userId, "213");

  const documentMeta = formatDocumentPayload(
    file,
    file?.name,
    categoryId,
    subCategoryId,
    userId,
  );
  return {
    ...documentMeta,

    documentId,
    documentType,
    documentExtension: file?.name?.split(".").pop() || "",

    documentMimeType: file?.type || "",
    documentTag,
    stateId,
    documentImageGroup,
    isDocumentShared,

    // actionId: 0,
    // uploaded: 1,

    documentList: [
      {
        documentInByte: base64,
        documentLabel: file?.name || "",
      },
    ],
  };
};
export const validateDocumentFile = (
  file,
  maxSizeMB = 5,
  allowedExtensions = ["pdf", "jpg", "jpeg", "png", "tiff"],
) => {
  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return { isValid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }

  const fileExtension = file.name.split(".").pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return { isValid: false, error: `File type .${fileExtension} not allowed` };
  }

  return { isValid: true, error: null };
};
