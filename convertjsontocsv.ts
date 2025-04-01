import * as fs from 'fs';
import * as path from 'path';
import fastcsv from 'fast-csv';


// Paths
const VASPS_INPUT_FOLDER = './input/VASPS';
const VASPS_OUTPUT_FOLDER = './output/VASPS';
const AUXILIARY_INPUT_FOLDER = './input/auxiliary';
const AUXILIARY_OUTPUT_FOLDER = './output/AUXILIARY';

// Ensure VASPS output folder exists
if (!fs.existsSync(VASPS_OUTPUT_FOLDER)) {
    fs.mkdirSync(VASPS_OUTPUT_FOLDER);
}

// Ensure AUXILIARY output folder exists
if (!fs.existsSync(AUXILIARY_OUTPUT_FOLDER)) {
  fs.mkdirSync(AUXILIARY_OUTPUT_FOLDER);
}

// Function to read JSON files from a directory
const readJsonFiles = (folderPath: string): any[] => {
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'));
    return files.map(file => {
        const filePath = path.join(folderPath, file);
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    });
};

// Function to write CSV files
const writeCsvFile = (filePath: string, data: any[]) => {
    const writeStream = fs.createWriteStream(filePath);
    const csvStream = fastcsv.format({ headers: true });

    // Filter out empty objects from the data before writing
    const nonEmptyData = data.filter(entry => Object.keys(entry).length > 0);

    // Pipe the stream to the write stream
    csvStream.pipe(writeStream);

    // Write each entry to the CSV
    nonEmptyData.forEach(entry => {
        csvStream.write(entry);
    });

    csvStream.end();
};

// Function to process VASP JSON and extract data
const processVaspJson = (jsonData: any[]) => {
    let mainCsvData: any[] = [];
    let subfieldData: Record<string, any[]> = {};
    let accountData: any[] = []; // Separate array for accounts

    jsonData.forEach((data) => {
        const { vaspId, ...mainFields } = data;
        const mainEntry: any = { vaspId, ...mainFields };
        
        // Remove subfields from the main CSV
        ['vaspType', 'names', 'countryRel', 'kyc', 'paymentMethods', 'billingDescriptor', 'tradingPairs', 'regulations', 'vaspSanction'].forEach(field => {
            delete mainEntry[field];
        });

        mainCsvData.push(mainEntry);

        // Process subfields
        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (!subfieldData[key]) subfieldData[key] = [];
                
                value.forEach((item) => {
                    if (typeof item === 'object') {
                        subfieldData[key].push({ vasp: vaspId, ...item }); // Ensure vasp is the second column
                    }
                });
            }
        });

        // Process paymentMethods separately to extract accounts
        if (Array.isArray(data.paymentMethods)) {
            data.paymentMethods.forEach((method: any) => {
                const { account, ...methodFields } = method;

                // Store paymentMethods separately (excluding account field)
                if (!subfieldData['paymentMethods']) {
                    subfieldData['paymentMethods'] = [];
                }
                subfieldData['paymentMethods'].push({ vasp: vaspId, ...methodFields });

                // Process accounts separately
                if (Array.isArray(account)) {
                    account.forEach((acc: any) => {
                        accountData.push({ ...acc, vasp: vaspId });
                    });
                }
            });
        }
    });

    // Write main CSV
    writeCsvFile(path.join(VASPS_OUTPUT_FOLDER, 'VASP.csv'), mainCsvData);

    // Write subfield CSVs
    Object.entries(subfieldData).forEach(([field, records]) => {
        writeCsvFile(path.join(VASPS_OUTPUT_FOLDER, `${field}.csv`), records);
    });

    // Write accounts CSV separately
    if (accountData.length > 0) {
        writeCsvFile(path.join(VASPS_OUTPUT_FOLDER, 'account.csv'), accountData);
    }
};


const getPrimaryIdField = (fileName: string): string => {
    switch (fileName.toLowerCase()) {
        case 'bank': return 'bankId';
        case 'countries': return 'countryId';
        case 'regulators': return 'regulatorId';
        case 'asset': return 'assetId';
        default: 
            console.warn(`⚠️ Unknown file: ${fileName}, defaulting to 'id'`);
            return 'id'; // Default if no match
    }
};

const processAuxiliaryJson = (filePath: string, fileName: string) => {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    let jsonData = JSON.parse(rawData);

    // Check if jsonData is an object and contains an array field
    if (!Array.isArray(jsonData)) {
        const firstKey = Object.keys(jsonData)[0]; // Get the first key (e.g., "countries")
        if (Array.isArray(jsonData[firstKey])) {
            jsonData = jsonData[firstKey]; // Extract the array
        } else {
            console.error(`❌ Invalid JSON format in ${fileName}.json`);
            return;
        }
    }

    let mainCsvData: any[] = [];
    let subfieldData: Record<string, any[]> = {};

    const primaryIdField = getPrimaryIdField(fileName);
    
    jsonData.forEach((data: any) => {
        const mainEntry: Record<string, any> = {};
        
        // If the primary ID field exists, include it; otherwise, proceed without it
        if (data[primaryIdField]) {
            mainEntry[primaryIdField] = data[primaryIdField];
        }

        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                // Handle subfields separately
                if (!subfieldData[key]) subfieldData[key] = [];
                value.forEach((item: Record<string, any>) => {
                    const subEntry: Record<string, any> = data[primaryIdField]
                        ? { [primaryIdField]: data[primaryIdField], ...item }
                        : { ...item }; // Include primary ID if available

                    subfieldData[key].push(subEntry);
                });
            } else {
                mainEntry[key] = value;
            }
        });

        mainCsvData.push(mainEntry);
    });

    // Write main CSV file
    writeCsvFile(path.join(AUXILIARY_OUTPUT_FOLDER, `${fileName}.csv`), mainCsvData);

    // Write subfield CSVs
    Object.entries(subfieldData).forEach(([field, records]) => {
        writeCsvFile(path.join(AUXILIARY_OUTPUT_FOLDER, `${fileName}_${field}.csv`), records);
    });
};

// Function to process multiple JSON files in the input folder
const processMultipleFiles = () => {
    if (!fs.existsSync(AUXILIARY_INPUT_FOLDER)) {
        console.error(`❌ Input folder '${AUXILIARY_INPUT_FOLDER}' does not exist.`);
        return;
    }

    // List all JSON files in the input folder
    const jsonFiles = fs.readdirSync(AUXILIARY_INPUT_FOLDER).filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
        console.warn("⚠️ No JSON files found in the input folder.");
        return;
    }

    // Process each JSON file
    jsonFiles.forEach(file => {
        const filePath = path.join(AUXILIARY_INPUT_FOLDER, file);
        const fileName = path.basename(file, '.json'); // Remove the .json extension
        processAuxiliaryJson(filePath, fileName); // Call the processing function for each file
    });
};

// Execute
const vaspsJsonData = readJsonFiles(VASPS_INPUT_FOLDER);
// const auxiliaryJsonData = readJsonFiles(AUXILIARY_INPUT_FOLDER);
processVaspJson(vaspsJsonData);
processMultipleFiles();
console.log('✅ CSV files generated in the VASPS and auxiliary output folder!');
