import { saveAs } from 'file-saver';

/**
 * Converts any image file into a base64 String
 * @param {File} file
 * @returns {Promise<String>}
 */
export function imageToString(file) {
    // Check File
    if (!file) return null

    // Check extension (less reliable)
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['png', 'jpg', 'jpeg'].includes(ext)) return null;

    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();

            reader.onload = function (e) {
                const url = e.target.result;
                resolve(url)
            };

            reader.readAsDataURL(file);
        } catch (error) {
            resolve(null)
        }
    })
}


/**
 * Download a json file
 * @param {*} data 
 * @param {Sring} fileName 
 */
export const downloadJSON = (data, fileName = 'tecode') => {
    // Check the json object
    if (!data) return;

    // Convert to readable JSON
    const json = JSON.stringify(data, null, 2);

    // Create Blob and save using FileSaver
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    saveAs(blob, `${fileName}-${new Date().toISOString().slice(0, 10)}.json`);
}


/**
 * Convert JSON File To Text
 * @param {File} file 
 * @returns {Promise<Object | null>}
 */
export const ObjectFromJSONFile = (file) => {
    if (!file) return null
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                resolve(json);
            } catch (err) {
                reject(null);
            }
        };
        reader.readAsText(file);
    });
}


export const exportJSON = (invList, name) => {
    const blob = new Blob(
        [JSON.stringify(invList, null, 2)],
        { type: 'application/json' },
    )

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name ? `${name}.json` : `invoices-${new Date().toString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export const getFileInfo = (file) => {
    const name = file.name;
    const lastDot = name.lastIndexOf(".");

    return {
        name: lastDot === -1 ? name : name.slice(0, lastDot),
        extension: lastDot === -1 ? "" : name.slice(lastDot + 1)
    };
};
