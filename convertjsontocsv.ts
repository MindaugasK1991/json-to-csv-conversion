import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";

// Helper function to get __dirname in ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Define types for config.json structure
interface Config {
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
}

// Define types for Country.json structure
interface CountryData {
    countries: {
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
        isUnSanctioned: boolean;
        isFinancialActionTaskForce: boolean;
    }[];
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

// Ensure the output directory exists
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

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

// Define CSV writer for Name.csv with headers from config.json
const namesCsvWriter = createObjectCsvWriter({
    path: path.join(outputDir, "Name.csv"),
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
    path: path.join(outputDir, "Regulators.csv"),
    header: regulatorsSchema.headers.map((header, index) => ({
        id: regulatorsSchema.fields[index],
        title: header
    }))
});

// Read Bank.json
const bankPath = path.join(__dirname, "input", "auxiliary", "Bank.json");
let bankData: any;
try {
    bankData = JSON.parse(fs.readFileSync(bankPath, "utf-8"));
    if (!bankData || !Array.isArray(bankData.banks)) {
        throw new Error("Invalid Bank.json structure: 'banks' should be an array.");
    }
} catch (error) {
    console.error("Error reading Bank.json:", error);
    process.exit(1);
}

// Read Regulators.json
const regulatoprsPath = path.join(__dirname, "input", "auxiliary", "Regulators.json");
let regulatorData: any;
try {
    regulatorData = JSON.parse(fs.readFileSync(regulatoprsPath, "utf-8"));
    if (!regulatorData || !Array.isArray(regulatorData.regulators)) {
        throw new Error("Invalid Regulators.json structure: 'regulators' should be an array.");
    }
} catch (error) {
    console.error("Error reading Regulators.json:", error);
    process.exit(1);
}


// Create a map for bankId to bank name
const bankMap = new Map(bankData.banks.map((bank: any) => [bank.bankId, bank.name]));

// Create a map for bankId to bank name
const regulatorMap = new Map(regulatorData.regulators.map((regulator: any) => [regulator.Id, regulator.name, regulator.jurisdiction]));

// Read all VASP JSON files
const vaspDirectoryPath = path.join(__dirname, "input", "VASPS");
const vaspFiles = fs.readdirSync(vaspDirectoryPath).filter(file => file.endsWith(".json"));

const accounts: any[] = [];
// Process each VASP.json file
vaspFiles.forEach(file => {
    const vaspPath = path.join(vaspDirectoryPath, file);
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(vaspPath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${file}: Missing 'vaspId' or 'commonName'.`);
        }
    } catch (error) {
        console.error(`Error reading ${file}:`, error);
        return; // Skip this file and continue with the next one
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;

    if (vaspData.paymentMethods) {
        vaspData.paymentMethods.forEach((paymentMethod: any) => {
            if (paymentMethod.account) {
                paymentMethod.account.forEach((account: any) => {
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
    }
});

// Check if there is data to write to Account.csv
if (accounts.length === 0) {
    console.error("No account data found to write to CSV.");
    process.exit(1);
}

// Write to Account.csv
accountCsvWriter.writeRecords(accounts)
    .then(() => console.log("Account.csv has been written successfully."))
    .catch(error => console.error("Error writing Account.csv:", error));

// Read Country.json
const countryPath = path.join(__dirname, "input", "auxiliary", "Country.json");
let countryData: CountryData;
try {
    countryData = JSON.parse(fs.readFileSync(countryPath, "utf-8"));
    if (!countryData || !Array.isArray(countryData.countries)) {
        throw new Error("Invalid Country.json structure: 'countries' should be an array.");
    }
} catch (error) {
    console.error("Error reading Country.json:", error);
    process.exit(1);
}

// Process the Country data
const countries = countryData.countries.map((country: any) => ({
    countryId: country.countryId || "",
    name: country.name || "",
    isoAlpha3: country.isoAlpha3 || "",
    isoAlpha2: country.isoAlpha2 || "",
    fsrb: country.fsrb || "",
    baselRank: country.baselRank || "",
    isAnyFatf: country.isAnyFatf ? true : false,
    isAnyFsrb: country.isAnyFsrb ? true : false,
    isSanctioned: country.isSanctioned ? true : false,
    isFatfBlacklist: country.isFatfBlacklist ? true : false,
    isFatfGreylist: country.isFatfGreylist ? true : false,
    isEuHighRisk: country.isEuHighRisk ? true : false,
    isOfacComprehensiveSanction: country.isOfacComprehensiveSanction ? true : false,
    isOfacSelectiveSanction: country.isOfacSelectiveSanction ? true : false,
    isUnSanctioned: country.isUnSanctioned ? true : false,
    isFinancialActionTaskForce: country.isFinancialActionTaskForce ? true : false
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
vaspFiles.forEach(file => {
    const vaspPath = path.join(vaspDirectoryPath, file);
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(vaspPath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${file}: Missing 'vaspId' or 'commonName'.`);
        }
    } catch (error) {
        console.error(`Error reading ${file}:`, error);
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
                nameType: name.type || "",
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
vaspFiles.forEach(file => {
    const vaspPath = path.join(vaspDirectoryPath, file);
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(vaspPath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${file}: Missing 'vaspId' or 'commonName'.`);
        }
    } catch (error) {
        console.error(`Error reading ${file}:`, error);
        return; // Skip this file and continue with the next one
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;

    if (vaspData.paymentMethods) {
        vaspData.paymentMethods.forEach((paymentMethod: any) => {
            paymentMethods.push({
                paymentMethodId: paymentMethod.paymentMethodId || "",
                vaspId: vaspId,
                commonName: commonName,
                paymentMethod: paymentMethod.paymentMethod || "",
                isAmountRestricted: paymentMethod.isAmountRestricted ? true : false,
                jurisdiction: paymentMethod.jurisdiction || "",
                onrampProviderId: paymentMethod.onrampProviderId || "",
                onrampProviderName: paymentMethod.onrampProviderName || ""
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


// Array to store the regulators data
const regulators: any[] = [];

// Process each VASP.json file to extract regulators data
vaspFiles.forEach(file => {
    const vaspPath = path.join(vaspDirectoryPath, file);
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(vaspPath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${file}: Missing 'vaspId' or 'commonName'.`);
        }
    } catch (error) {
        console.error(`Error reading ${file}:`, error);
        return; // Skip this file and continue with the next one
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;

    if (vaspData.regulations) {
        vaspData.regulations.forEach((regulator: any) => {
            regulators.push({
                regulationId: regulator.regulationId || "",
                vaspId: vaspId,
                commonName: commonName,
                regulator: regulator.regulator || "",
                name: regulatorMap.get(regulator.name) || "",
                jurisdiction: regulatorMap.get(regulator.jurisdiction) || "",
                number: regulator.number || "",
                openedDate: regulator.openedDate || ""
            });
        });
    }
});

// Check if there is data to write to Regulators.csv
if (regulators.length === 0) {
    console.error("No data found to write to CSV.");
    process.exit(1);
}

// Write to Regulators.csv
regulatorsCsvWriter.writeRecords(regulators)
    .then(() => console.log("Regulators.csv has been written successfully."))
    .catch(error => console.error("Error writing Regulators.csv:", error));