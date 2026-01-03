// Bun provides global 'fetch' and 'FormData'.

// Note: In Node environments without global fetch/FormData (pre-v18), you might need 'node-fetch' and 'form-data' packages.
// Since we are using Bun or modern Node, we typically have access to fetch.
// However, 'form-data' package is often safer for server-side multipart construction if global FormData is lacking or behave differently.
// Let's assume global fetch/FormData for now as per previous context, but strictly speaking for backend 'form-data' package is often used.
// Checking package.json previously, I did NOT see 'node-fetch' or 'form-data' in dependencies.
// The user's environment might be Bun (which has built-ins).
// I will write this using standard globals assuming Bun/Node18+.

const extractTextFromPDF = async (buffer) => {
    if (!buffer) return "";
    try {
        const formData = new FormData();
        // In standard web FormData/Bun, we append a Blob. In Node with 'form-data' package, we append buffer.
        // Since we don't have 'form-data' package explicitly installed in package.json (unless I missed it), 
        // and we are likely in Bun or Node 18+, let's stick to the implementation that was in the controller 
        // but ensure we handle the buffer correctly.

        // The previous implementation used a base64 string strategy to avoid Blob/Buffer complexity with vanilla FormData.
        const base64File = `data:application/pdf;base64,${buffer.toString('base64')}`;

        formData.append('base64Image', base64File);
        formData.append('isOverlayRequired', 'false');
        formData.append('apikey', process.env.OCR_SPACE_API_KEY);
        formData.append('language', 'eng');

        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.IsErroredOnProcessing) {
            console.error("OCR Error:", data.ErrorMessage);
            return "";
        }

        if (data.ParsedResults && data.ParsedResults.length > 0) {
            return data.ParsedResults.map(r => r.ParsedText).join("\n");
        }
        return "";

    } catch (error) {
        console.error("OCR Exception:", error);
        return "";
    }
};

module.exports = { extractTextFromPDF };
