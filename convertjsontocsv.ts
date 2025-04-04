import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";

// Helper function to get __dirname in ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Define types for config.json structure
interface Config {

    Vasps: {
        headers: string[];
        fields: string[];
    };

    Account: {
        headers: string[];
        fields: string[];
    };
    Country: {
        headers: string[];
        fields: string[];
    };

    Names: {
        headers: string[];
        fields: string[];
    };

    Payment_Methods: {
        headers: string[];
        fields: string[];
    };

    Regulations: {
        headers: string[];
        fields: string[];
    };

    Trading_Pairs: {
        headers: string[];
        fields: string[];
    };

    Categories: {
        headers: string[];
        fields: string[];
    };

    Kyc: {
        headers: string[];
        fields: string[];
    };

    Sanctions: {
        headers: string[];
        fields: string[];
    };
}

// Define types for Vasps.json structure
interface VaspData {
        vaspId: string; 
        commonName: string;
        url: string;
        isReported: string; 
        domiciledCountry: string, 
        hqRegion: string; 
        isSanctioned: boolean; 
        directOnramp: boolean;
        indirectOnramp: boolean;
        hasOfframp: boolean;
        tradesFiat: boolean;
        tradesPrivacyCoins: boolean;
        isDecentralized: boolean;
        hasKyc: boolean;
        openedDate: string;
        closedDate: string;
        isCustodial: boolean;
        AML_Policy_URL: string; 
}

// Define types for Country.json structure
interface CountryData {
    
        countryId: string;
        name: string;
        isoAlpha3: string;
        isoAlpha2: string;
        fsrb: string;
        baselRank: string;
        isAnyFatf: boolean;
        isAnyFsrb: boolean;
        isSanctioned: boolean;
        isFatfBlacklist: boolean;
        isFatfGreylist: boolean;
        isEuHighRisk: boolean;
        isOfacComprehensiveSanction: boolean;
        isOfacSelectiveSanction: boolean;
        // sanctions: any[];
    
}

// Define types for VASP JSON structure related to Names
interface Name {
    nameId: string;
    type: string;
    name: string;
    country: string;
}

// Define types for VASP JSON structure related to Payment_Methods
interface PaymentMethod {
    paymentMethodId: string;
    paymentMethod: string;
    isAmountRestricted: boolean;
    jurisdiction: string;
    onRampProviderId: string;
    onRampProviderName: string;
}

// Define types for VASP JSON structure related to Regulators
interface Regulations {
    regulatorId: string;
    regulator: string;
    name: string;
    jurisdiction: string;
    number: string;
    openedDate: string;
    closedDate: string;
}

// Define types for VASP JSON structure related to Trading_Pairs
interface TradingPairs {
    traidingPairId: string;
    from: string;
    From_chain: string;
    to: string;
    To_chain: string;
    Is_Privacy: boolean;
    Is_Fiat: boolean;
}

interface Categories {
    vaspTypeId: string;
    type: string;
}

interface Kyc {
    kycId: string; 
    requires2fa: boolean; 
    legalNameRequired: boolean; 
    dobRequired: boolean;
    addressRequired: boolean;
    ssn_tinRequired: boolean;
    countryOfCitizenshipRequired: boolean;
    govtIdRequired: boolean;
    proofOfResidencyRequired: boolean;
    emailRequired: boolean; 
    phoneRequired: boolean;
    selfieRequired: boolean;
    videoRequired: boolean; 
    transactionLimitsExist: boolean;
    amountLimit: number;
    currency: string;
    limitFrequency: string;
    notes: string;
}

interface Sanctions {
    vaspSanctionId: string;
    Vasp: string;
    sanctioningBody: string;
    sanctionUrl: string;
    sanctionType: string;
    sanctionStart: string;
    sanctionEnd: string;
}

interface SanctioningBody {
    sanctioningbodyId: string;
    name: string;
}

// Load config.json to get headers and field mappings
const configPath = path.join(__dirname, "config.json");
let config: Config;
try {
    config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
} catch (error) {
    console.error("Error reading config.json:", error);
    process.exit(1);
}
const accountSchema = config.Account;
const countrySchema = config.Country;
const namesSchema = config.Names;
const paymentMethodsSchema = config.Payment_Methods;
const regulatorsSchema = config.Regulations;
const tradingPairsSchema = config.Trading_Pairs; 
const categoriesSchema = config.Categories;
const kycSchema = config.Kyc;
const sanctionsSchema = config.Sanctions;
const vaspSchema = config.Vasps;

// Ensure the output directory exists
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Define CSV writer for Vasps.csv with headers from config.json
const vaspsCsvWriter = createObjectCsvWriter({
    path: path.join(outputDir, "Vasps.csv"),
    header: vaspSchema.headers.map((header, index) => ({
        id: vaspSchema.fields[index],
        title: header
    }))
});

// Define CSV writer for Account.csv with headers from config.json
const accountCsvWriter = createObjectCsvWriter({
    path: path.join(outputDir, "Account.csv"),
    header: accountSchema.headers.map((header, index) => ({
        id: accountSchema.fields[index],
        title: header
    }))
});

// Define CSV writer for Country.csv with headers from config.json
const countryCsvWriter = createObjectCsvWriter({
    path: path.join(outputDir, "Country.csv"),
    header: countrySchema.headers.map((header, index) => ({
        id: countrySchema.fields[index],
        title: header
    }))
});

// Define CSV writer for Names.csv with headers from config.json
const namesCsvWriter = createObjectCsvWriter({
    path: path.join(outputDir, "Names.csv"),
    header: namesSchema.headers.map((header, index) => ({
        id: namesSchema.fields[index],
        title: header
    }))
});

// Define CSV writer for Paymen_tMethods.csv with headers from config.json
const paymentMethodsCsvWriter = createObjectCsvWriter({
    path: path.join(outputDir, "Payment_Methods.csv"),
    header: paymentMethodsSchema.headers.map((header, index) => ({
        id: paymentMethodsSchema.fields[index],
        title: header
    }))
});

// Define CSV writer for Regulators.csv with headers from config.json
const regulatorsCsvWriter = createObjectCsvWriter({
    path: path.join(outputDir, "Regulations.csv"),
    header: regulatorsSchema.headers.map((header, index) => ({
        id: regulatorsSchema.fields[index],
        title: header
    }))
});

// Define CSV writer for Trading_Pairs.csv with headers from config.json
const tradingPairsCsvWriter = createObjectCsvWriter({
    path: path.join(outputDir, "Trading_Pairs.csv"),
    header: tradingPairsSchema.headers.map((header, index) => ({
        id: tradingPairsSchema.fields[index],
        title: header
    }))
});

// Define CSV writer for Categories.csv with headers from config.json
const categoriesPairsCsvWriter = createObjectCsvWriter({
    path: path.join(outputDir, "Categories.csv"),
    header: categoriesSchema.headers.map((header, index) => ({
        id: categoriesSchema.fields[index],
        title: header
    }))
});

// Define CSV writer for Categories.csv with headers from config.json
const kycPairsCsvWriter = createObjectCsvWriter({
    path: path.join(outputDir, "Kyc.csv"),
    header: kycSchema.headers.map((header, index) => ({
        id: kycSchema.fields[index],
        title: header
    }))
});

// Define CSV writer for Sanctions.csv with headers from config.json
const sanctionsPairsCsvWriter = createObjectCsvWriter({
    path: path.join(outputDir, "Sanctions.csv"),
    header: sanctionsSchema.headers.map((header, index) => ({
        id: sanctionsSchema.fields[index],
        title: header
    }))
});

// Read Bank.json
const bankPath = path.join(__dirname, "data", "Auxiliaries", "bank.json");
let bankData: any;
try {
    bankData = JSON.parse(fs.readFileSync(bankPath, "utf-8"));
    // if (!bankData || !Array.isArray(bankData.banks)) {
    //     throw new Error("Invalid Bank.json structure: 'banks' should be an array.");
    // }
} catch (error) {
    console.error("Error reading bank.json:", error);
    process.exit(1);
}

// Read Regulators.json
const regulatorsPath = path.join(__dirname, "data", "Auxiliaries", "regulator.json");
let regulatorData: any;
try {
    regulatorData = JSON.parse(fs.readFileSync(regulatorsPath, "utf-8"));
    // if (!regulatorData || !Array.isArray(regulatorData.regulators)) {
    //     throw new Error("Invalid Regulators.json structure: 'regulators' should be an array.");
    // }
} catch (error) {
    console.error("Error reading Regulators.json:", error);
    process.exit(1);
}

// Read SanctioningBody.json
const sanctioningBodyPath = path.join(__dirname, "data", "Auxiliaries", "sanctioning_body.json");
let sanctioningBodyData: any;
try {
    sanctioningBodyData = JSON.parse(fs.readFileSync(sanctioningBodyPath, "utf-8"));
    // if (!sanctioningBodyData || !Array.isArray(sanctioningBodyData.sanctioning_body)) {
    //     throw new Error("Invalid SanctioningBody.json structure: 'sanctioning_body' should be an array.");
    // }
} catch (error) {
    console.error("Error reading Regulators.json:", error);
    process.exit(1);
}

// Create a map for bankId to bank name
const bankMap = new Map(bankData.map((bank: any) => [bank.bankId, bank.name]));

// Create a map for regulator
const regulatorMap = new Map(regulatorData.map((regulator: any) => [regulator.Id, regulator.name, regulator.jurisdiction]));


// Set the base directory
const vaspDirectoryPath = path.join(__dirname, "data");

// Function to find all JSON files in VASP subdirectories and filter by `isReported: true`
function findJsonFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });

    list.forEach(dirent => {
        const fullPath = path.join(dir, dirent.name); // Construct the full path

        if (dirent.isDirectory()) {
            results = results.concat(findJsonFiles(fullPath)); // Recursively scan subdirectories
        } else if (dirent.isFile() && dirent.name.endsWith("_data.json")) {
            // Only process files with "_data.json" extension
            try {
                const jsonData = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
                
                // Check if `isReported` is true
                if (jsonData.hasOwnProperty('isReported') && jsonData.isReported === true) {
                    // Add file to results if `isReported: true`
                    results.push(fullPath);
                }
            } catch (error) {
                console.error(`❌ Error reading ${fullPath}:`, error);
            }
        }
    });

    return results;
}

// Get all matching JSON files that have isReported: true
const vaspFiles = findJsonFiles(vaspDirectoryPath);

// Debugging log
console.log("✅ Found JSON files with isReported: true:", vaspFiles);

// Example later processing - Just logging the file paths here
vaspFiles.forEach(filePath => {
    console.log(`📄 Processed: ${filePath}`);
});

console.log("Files to process:", vaspFiles);

const accounts: any[] = [];
const vasps: any[] = []; // New array to store VASP data

// Process each VASP.json file
vaspFiles.forEach(filePath => {
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${filePath}: Missing 'vaspId' or 'commonName'.`);
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return; // Skip this file and continue with the next one
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;

    // Collect main VASP data
    vasps.push({
        vaspId: vaspData.vaspId || "",
        commonName: vaspData.commonName,
        url: vaspData.url || "",
        isReported: vaspData.isReported || "",
        domiciledCountry: vaspData.domiciledCountry || "",
        hqRegion: vaspData.hqRegion || "",
        isSanctioned: typeof vaspData.isSanctioned === "boolean" ? vaspData.isSanctioned : "",
        directOnramp: typeof vaspData.directOnramp === "boolean" ? vaspData.directOnramp : "",
        indirectOnramp: typeof vaspData.indirectOnramp === "boolean" ? vaspData.indirectOnramp : "",
        hasOfframp: typeof vaspData.hasOfframp === "boolean" ? vaspData.hasOfframp : "",
        tradesFiat: typeof vaspData.tradesFiat === "boolean" ? vaspData.tradesFiat : "",
        tradesPrivacyCoins: typeof vaspData.tradesPrivacyCoins === "boolean" ? vaspData.tradesPrivacyCoins : "",
        isDecentralized: typeof vaspData.isDecentralized === "boolean" ? vaspData.isDecentralized : "",
        hasKyc: typeof vaspData.hasKyc === "boolean" ? vaspData.hasKyc : "",
        openedDate: vaspData.openedDate || "",  
        closedDate: vaspData.closedDate || "",
        isCustodial: typeof vaspData.isCustodial === "boolean" ? vaspData.isCustodial : "",
        AML_Policy_URL: vaspData.AML_Policy_URL || ""
    });

    // Collect account data under paymentMethods
    if (vaspData.paymentMethods) {
        console.log(`Processing payment methods for VASP: ${vaspId} - ${commonName}`);
        vaspData.paymentMethods.forEach((paymentMethod: any) => {
            if (paymentMethod.account) {
                console.log(`Processing accounts for payment method: ${JSON.stringify(paymentMethod)}`);
                paymentMethod.account.forEach((account: any) => {
                    console.log(`Account data: ${JSON.stringify(account)}`);
                    accounts.push({
                        accountId: account.accountId || "",
                        vaspId: vaspId,
                        commonName: commonName,
                        routingType: account.routingType || "",
                        localRouting: account.localRouting || "",
                        bic: account.bic || "",
                        iban: account.iban || "",
                        number: account.number || "",
                        bank: account.bank || "",
                        bankName: bankMap.get(account.bank) || "",
                        bankRole: account.bankRole || "",
                        country: account.country || ""
                    });
                });
            }
        });
    } else {
        console.log(`No payment methods found for ${vaspId} - ${commonName}`);
    }
});

// Check and write to Vasps.csv
if (vasps.length === 0) {
    console.error("No VASP data found to write to CSV.");
    process.exit(1);
}

vaspsCsvWriter.writeRecords(vasps)
    .then(() => console.log("Vasps.csv has been written successfully."))
    .catch(error => console.error("Error writing Vasps.csv:", error));

// Check and write to Account.csv
if (accounts.length === 0) {
    console.error("No account data found to write to CSV.");
    process.exit(1);
}

accountCsvWriter.writeRecords(accounts)
    .then(() => console.log("Account.csv has been written successfully."))
    .catch(error => console.error("Error writing Account.csv:", error));


// Read Country.json
const countryPath = path.join(__dirname, "data", "Auxiliaries", "country.json");
let countryData: CountryData;
try {
    countryData = JSON.parse(fs.readFileSync(countryPath, "utf-8"));
    // if (!countryData || !Array.isArray(countryData.countries)) {
    //     throw new Error("Invalid Country.json structure: 'countries' should be an array.");
    // }
} catch (error) {
    console.error("Error reading Country.json:", error);
    process.exit(1);
}

// Process the Country data
const countries = (Array.isArray(countryData) ? countryData : []).map((country: any) => ({
    countryId: country.countryId || "",
    name: country.name || "",
    isoAlpha3: country.isoAlpha3 || "",
    isoAlpha2: country.isoAlpha2 || "",
    fsrb: country.fsrb || "",
    baselRank: country.baselRank || "",
    isAnyFatf: typeof country.isAnyFatf === "boolean" ? country.isAnyFatf : "",
    isAnyFsrb: typeof country.isAnyFsrb === "boolean" ? country.isAnyFsrb : "",
    isSanctioned: typeof country.isSanctioned === "boolean" ? country.isSanctioned : "",
    isFatfBlacklist: typeof country.isFatfBlacklist === "boolean" ? country.isFatfBlacklist : "",
    isFatfGreylist: typeof country.isFatfGreylist === "boolean" ? country.isFatfGreylist : "",
    isEuHighRisk: typeof country.isEuHighRisk === "boolean" ? country.isEuHighRisk : "",
    isOfacComprehensiveSanction: typeof country.isOfacComprehensiveSanction === "boolean" ? country.isOfacComprehensiveSanction : "",
    isOfacSelectiveSanction: typeof country.isOfacSelectiveSanction === "boolean" ? country.isOfacSelectiveSanction : "",
    sanctions: country.sanctions || []
}));

// Check if there is data to write to Country.csv
if (countries.length === 0) {
    console.error("No country data found to write to CSV.");
    process.exit(1);
}

// Write to Country.csv
countryCsvWriter.writeRecords(countries)
    .then(() => console.log("Country.csv has been written successfully."))
    .catch(error => console.error("Error writing Country.csv:", error));

// Array to store the names data
const names: any[] = [];

// Process each VASP.json file to extract names data
vaspFiles.forEach(filePath => {
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${filePath}: Missing 'vaspId' or 'commonName'.`);
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return; // Skip this file and continue with the next one
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;

    if (vaspData.names) {
        vaspData.names.forEach((name: Name) => {
            names.push({
                nameId: name.nameId || "",
                vaspId: vaspId,
                commonName: commonName,  // Correctly use commonName for VASP_NAME
                type: name.type || "",
                name: name.name || "",
                country: name.country || ""
            });
        });
    }
});

// Check if there is data to write to Names.csv
if (names.length === 0) {
    console.error("No name data found to write to CSV.");
    process.exit(1);
}

// Write to Names.csv
namesCsvWriter.writeRecords(names)
    .then(() => console.log("Names.csv has been written successfully."))
    .catch(error => console.error("Error writing Names.csv:", error));

// Array to store the payment methods data
const paymentMethods: any[] = [];

// Process each VASP.json file to extract payment methods data
const vaspMap = new Map<string, string>();

// First, read all VASP files and populate the map
vaspFiles.forEach(filePath => {
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${filePath}: Missing 'vaspId' or 'commonName'.`);
        }
        vaspMap.set(vaspData.vaspId, vaspData.commonName); // Store vaspId -> commonName
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
    }
});

// Now, process the VASP files again and extract payment methods
vaspFiles.forEach(filePath => {
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${filePath}: Missing 'vaspId' or 'commonName'.`);
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return;
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;

    if (vaspData.paymentMethods) {
        vaspData.paymentMethods.forEach((paymentMethod: PaymentMethod) => {
            const onrampProviderId = paymentMethod.onRampProviderId || "";
            const onrampProviderName = vaspMap.get(onrampProviderId) || ""; // Lookup commonName

            paymentMethods.push({
                paymentMethodId: paymentMethod.paymentMethodId || "",
                vaspId: vaspId,
                commonName: commonName,
                paymentMethod: paymentMethod.paymentMethod || "", 
                isAmountRestricted: typeof paymentMethod.isAmountRestricted === "boolean" ? paymentMethod.isAmountRestricted : "",                
                jurisdiction: paymentMethod.jurisdiction || "",
                onrampProviderId: onrampProviderId,
                onrampProviderName: onrampProviderName // Extracted commonName
            });
        });
    }
});


// Check if there is data to write to Payment_Methods.csv
if (paymentMethods.length === 0) {
    console.error("No data found to write to CSV.");
    process.exit(1);
}

// Write to Names.csv
paymentMethodsCsvWriter.writeRecords(paymentMethods)
    .then(() => console.log("Payment_Methods.csv has been written successfully."))
    .catch(error => console.error("Error writing Payment_Methods.csv:", error));

//Regulations

// Read and parse Regulators.json
let regulatorsData: any;
try {
    regulatorsData = JSON.parse(fs.readFileSync(regulatorsPath, "utf-8"));
    // console.log("Regulators.json loaded:", regulatorsData); // Debug log

    // Ensure the file has the expected structure
    // if (!regulatorsData || !Array.isArray(regulatorsData.regulators)) {
    //     throw new Error("Invalid structure: 'regulators' key is missing or not an array.");
    // }

    // Populate regulatorMap using the nested array
    regulatorsData.forEach((regulator: any) => {
        if (regulator.regulatorId) {
            regulatorMap.set(regulator.regulatorId, {
                name: regulator.name ?? "",
                jurisdiction: regulator.jurisdiction ?? ""
            });
        }
    });

    // console.log("Regulator Map:", regulatorMap); // Debug log
} catch (error) {
    console.error(`Error reading Regulators.json:`, error);
    process.exit(1);
}

// Array to store the regulations data
const regulators: any[] = [];

// Process each VASP.json file to extract regulations data
vaspFiles.forEach(filePath => {
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${filePath}: Missing 'vaspId' or 'commonName'.`);
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return;
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;
    const openedDate = vaspData.openedDate;
    const closedDate = vaspData.closedDate;

    if (vaspData.regulations) {
        vaspData.regulations.forEach((regulation: any) => {
            const regulatorDetails = regulatorMap.get(regulation.regulator) as { name: string; jurisdiction: string } || { name: "", jurisdiction: "" };

            // console.log(`Matching Regulator: ${regulation.regulator}`, regulatorDetails); // Debug log

            regulators.push({
                regulationId: regulation.regulationId || "",
                vaspId: vaspId,
                commonName: commonName,
                regulator: regulation.regulator || "",
                name: regulatorDetails.name,         // ✅ Extracted from Regulators.json
                jurisdiction: regulatorDetails.jurisdiction, // ✅ Extracted from Regulators.json
                number: regulation.number || "",
                openedDate: openedDate|| "",
                closedDate: closedDate || ""
            });
        });
    }
});

// Check if there is data to write to Regulations.csv
if (regulators.length === 0) {
    console.error("No data found to write to CSV.");
    process.exit(1);
}

// Write to Regulations.csv
regulatorsCsvWriter.writeRecords(regulators)
    .then(() => console.log("Regulators.csv has been written successfully."))
    .catch(error => console.error("Error writing Regulations.csv:", error));


// Array to store the trading pairs data
const tradingPairs: any[] = [];

// Process each VASP.json file to extract trading pairs data
vaspFiles.forEach(filePath => {
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${filePath}: Missing 'vaspId' or 'commonName'.`);
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return; // Skip this file and continue with the next one
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;

    if (vaspData.tradingPairs) {
        vaspData.tradingPairs.forEach((tradingPair: TradingPairs) => {
            tradingPairs.push({
                traidingPairId: tradingPair.traidingPairId || "",
                vaspId: vaspId,
                commonName: commonName,  // Correctly use commonName for VASP_NAME
                from: tradingPair.from || "",
                From_chain: tradingPair.From_chain || "",
                to: tradingPair.to || "",
                To_chain: tradingPair.To_chain || "",
                Is_Privacy: typeof tradingPair.Is_Privacy === "boolean" ? tradingPair.Is_Privacy : "",
                Is_Fiat: typeof tradingPair.Is_Fiat === "boolean" ? tradingPair.Is_Fiat : ""
            });
        });
    }
});

// Check if there is data to write to Trading_Pairs.csv
if (tradingPairs.length === 0) {
    console.error("No trading pairs data found to write to CSV.");
    process.exit(1);
}

// Write to Trading_Pairs.csv
tradingPairsCsvWriter.writeRecords(tradingPairs)
    .then(() => console.log("Trading_Pairs.csv has been written successfully."))
    .catch(error => console.error("Error writing Trading_Pairs.csv:", error));

// Array to store the categories data
const categories: any[] = [];

// Process each VASP.json file to extract trading pairs data
vaspFiles.forEach(filePath => {
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${filePath}: Missing 'vaspId' or 'commonName'.`);
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return; // Skip this file and continue with the next one
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;

    if (vaspData.vaspType) {
        vaspData.vaspType.forEach((category: Categories) => {
            categories.push({
                vaspTypeId: category.vaspTypeId || "",
                vaspId: vaspId,
                commonName: commonName,  // Correctly use commonName for VASP_NAME
                type: category.type || ""
            });
        });
    }
});

// Check if there is data to write to Categories.csv
if (categories.length === 0) {
    console.error("No categories data found to write to CSV.");
    process.exit(1);
}

// Write to Categories.csv
categoriesPairsCsvWriter.writeRecords(categories)
    .then(() => console.log("Categories.csv has been written successfully."))
    .catch(error => console.error("Error writing Categories.csv:", error));


// Array to store the KYC data
const kycData: any[] = [];

// Process each VASP.json file to extract kyc data
vaspFiles.forEach(filePath => {
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${filePath}: Missing 'vaspId' or 'commonName'.`);
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return; // Skip this file and continue with the next one
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;

    if (vaspData.kyc) {
        vaspData.kyc.forEach((kyc: Kyc) => {
            kycData.push({
                kycId: kyc.kycId || "",
                vaspId: vaspId,
                commonName: commonName,  // Correctly use commonName for VASP_NAME
                requires2fa: typeof kyc.requires2fa === "boolean" ? kyc.requires2fa : "",
                legalNameRequired: typeof kyc.legalNameRequired === "boolean" ? kyc.legalNameRequired : "",
                dobRequired: typeof kyc.dobRequired === "boolean" ? kyc.dobRequired : "",
                addressRequired: typeof kyc.addressRequired === "boolean" ? kyc.addressRequired : "",
                ssn_tinRequired: typeof kyc.ssn_tinRequired === "boolean" ? kyc.ssn_tinRequired : "",
                countryOfCitizenshipRequired: typeof kyc.countryOfCitizenshipRequired === "boolean" ? kyc.countryOfCitizenshipRequired : "",
                govtIdRequired: typeof kyc.govtIdRequired === "boolean" ? kyc.govtIdRequired : "",
                proofOfResidencyRequired: typeof kyc.proofOfResidencyRequired === "boolean" ? kyc.proofOfResidencyRequired : "",
                emailRequired: typeof kyc.emailRequired === "boolean" ? kyc.emailRequired : "",
                phoneRequired: typeof kyc.phoneRequired === "boolean" ? kyc.phoneRequired : "",
                selfieRequired: typeof kyc.selfieRequired === "boolean" ? kyc.selfieRequired : "",
                videoRequired: typeof kyc.videoRequired === "boolean" ? kyc.videoRequired : "",
                transactionLimitsExist: typeof kyc.transactionLimitsExist === "boolean" ? kyc.transactionLimitsExist : "",
                amountLimit: kyc.amountLimit || "",
                currency: kyc.currency || "",
                limitFrequency: kyc.limitFrequency || "",
                notes: kyc.notes || ""
            });
        });
    }
});

// Check if there is data to write to Kyc.csv
if (kycData.length === 0) {
    console.error("No kyc data found to write to CSV.");
    process.exit(1);
}

// Write to Categories.csv
kycPairsCsvWriter.writeRecords(kycData)
    .then(() => console.log("Kyc.csv has been written successfully."))
    .catch(error => console.error("Error writing Kyc.csv:", error));


// Read Vasp_Sanctions.json
// SanctioningBody.json processing logic is already defined earlier, so this duplicate block is removed.

// Create a map for quick lookup of sanctioning body names
const sanctioningBodyMap: Map<string, string> = new Map();

// Read and parse Sanctioning_Body.json
try {
    const vaspSanctioningBodyData = JSON.parse(fs.readFileSync(sanctioningBodyPath, "utf-8"));
    // console.log("✅ Sanctioning_Body.json loaded:", vaspSanctioningBodyData); // Debug log

    // Ensure the file has the expected structure
    // if (!vaspSanctioningBodyData || !Array.isArray(vaspSanctioningBodyData.sanctioning_body)) {
    //     throw new Error("❌ Invalid structure: 'sanctioning_body' key is missing or not an array.");
    // }

    // Populate sanctioningBodyMap using the nested array
    vaspSanctioningBodyData.forEach((body: any) => {
        if (body.sanctioningBodyId && body.name) { // ✅ Only add valid entries
            sanctioningBodyMap.set(body.sanctioningBodyId, body.name);
        }
    });

    // console.log("✅ Sanctioning_Body Map:", sanctioningBodyMap); // Debug log
} catch (error) {
    console.error(`❌ Error reading Sanctioning_Body.json:`, error);
    process.exit(1);
}

// Array to store the Sanctions data
const sanctionsData: any[] = [];

// Read Vasp_Sanctions.json
// const vaspSanctionsPath = path.join(__dirname, "data", "Auxiliaries", "Vasp_Sanctions.json");
// let vaspSanctionData: { sanctions: Sanctions[] };

// try {
//     vaspSanctionData = JSON.parse(fs.readFileSync(vaspSanctionsPath, "utf-8"));
//     if (!vaspSanctionData || !Array.isArray(vaspSanctionData.sanctions)) {
//         throw new Error("Invalid Vasp_Sanctions.json structure: 'sanctions' should be an array.");
//     }
// } catch (error) {
//     console.error("Error reading Vasp_Sanctions.json:", error);
//     process.exit(1);
// }

// console.log("✅ Extracted sanctions data:", vaspSanctionData.sanctions);

// Create a map for quick lookup of common names by vaspId
// const vaspCommonNameMap: Map<string, string> = new Map();

// Process each VASP.json file to build the vaspCommonNameMap
// vaspFiles.forEach(filePath => {

//     let vaspData: any;
//     try {
//         vaspData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//         if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
//             throw new Error(`Invalid structure in ${filePath}: Missing 'vaspId' or 'commonName'.`);
//         }
//     } catch (error) {
//         console.error(`Error reading ${filePath}:`, error);
//         return; // Skip this file and continue with the next one
//     }

//     const vaspId = vaspData.vaspId;
//     const commonName = vaspData.commonName;

//     if (vaspData.vaspSanction) {
//         vaspData.vaspSanction.forEach((sanction: Sanctions) => {
//             const sanctioningBodyName: string = sanctioningBodyMap.get(sanction.sanctioningBody) || "";

//             sanctionsData.push({
//                 Vasp_sanction_ID: sanction.vaspSanctionId || "",
//                 vaspId: vaspId,
//                 commonName: commonName,
//                 Sanctioning_Body: sanction.sanctioningBody || "",
//                 name: sanctioningBodyName,
//                 Sanction_Url: sanction.sanctionUrl || "",
//                 Sanction_Type: sanction.sanctionType || "",
//                 Sanction_start: sanction.sanctionStart || "",
//                 Sanction_end: sanction.sanctionEnd || ""
//             });
//         });

//     }
// });        // Process each sanction entry
// // vaspData.vaspSanctions.forEach((sanction: Sanctions) => {
// //     const sanctioningBodyName: string = sanctioningBodyMap.get(sanction.Sanctioning_Body) || "";
// //     const commonName: string = vaspCommonNameMap.get(sanction.Vasp) || "";

// //     // Only add if either name or commonName is found
// //     if (sanctioningBodyName || commonName) {
// //         sanctionsData.push({
// //             Vasp_sanction_ID: sanction.vaspSanctionId || "",
// //             commonName: commonName,
// //             Sanctioning_Body: sanction.Sanctioning_Body || "",
// //             name: sanctioningBodyName,
// //             Sanction_URL: sanction.Sanction_Url || "",
// //             Sanction_Type: sanction.Sanction_Type || "",
// //             Sanction_start: sanction.Sanction_start || "",
// //             Sanction_end: sanction.Sanction_end || "",
// //         });
// //     }
// // });
// //     } catch (error) {
// //         console.error(`Error reading ${filePath}:`, error);
// //         return; // Skip this file and continue with the next one
// //     }
// // });

// // console.log("✅ Extracted common names:", vaspCommonNameMap);



// // Check if there is data to write to CSV
// if (sanctionsData.length === 0) {
//     console.error("No sanctions data found to write to CSV.");
//     process.exit(1);
// }

// // Write to Sanctions.csv
// sanctionsPairsCsvWriter.writeRecords(sanctionsData)
//     .then(() => console.log("✅ Sanctions.csv has been written successfully."))
//     .catch(error => console.error("❌ Error writing Sanctions.csv:", error));
