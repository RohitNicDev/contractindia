export const formatDocumentPayload = (file, documentName, categoryId, subCategoryId) => {
    return {
        userDocumentID: 0,
        userID: 0,
        documentName: documentName || file.name,
        documentCategoryID: categoryId,
        documentCategoryName: '',
        documentSubCategoryID: subCategoryId,
        documentSubCategoryName: '',
        documentPath: '', // Will be set by backend
        fileExtension: file.name.split('.').pop(),
        fileSizeKB: Math.round(file.size / 1024),
        isActive: 1,
        createdBy: 0,
        createdDate: new Date().toISOString(),
        updatedBy: 0,
        updatedDate: new Date().toISOString(),
    };
};
export const validateDocumentFile = (file, maxSizeMB = 5, allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'tiff']) => {
    if (!file) {
        return { isValid: false, error: 'No file selected' };
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
        return { isValid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        return { isValid: false, error: `File type .${fileExtension} not allowed` };
    }

    return { isValid: true, error: null };
};