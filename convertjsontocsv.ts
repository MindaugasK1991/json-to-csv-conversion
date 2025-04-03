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

// Define types for Country.json structure
interface vaspData {
    data: {
        vaspId: string; 
        commonName: string;
        url: string; 
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
        // sanctions: any[];
    };
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
    tradingPairId: string;
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
    amountLimit: boolean;
    currency: string;
    limitFrequency: boolean;
    notes: string;
}

interface Sanctions {
    Vasp_sanction_ID: string;
    Vasp: string;
    Sanctioning_Body: string;
    Sanction_Url: string;
    Sanction_Type: string;
    Sanction_start: string;
    Sanction_end: string;
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
    path: path.join(outputDir, "KYC.csv"),
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
const regulatorsPath = path.join(__dirname, "input", "auxiliary", "Regulators.json");
let regulatorData: any;
try {
    regulatorData = JSON.parse(fs.readFileSync(regulatorsPath, "utf-8"));
    if (!regulatorData || !Array.isArray(regulatorData.regulators)) {
        throw new Error("Invalid Regulators.json structure: 'regulators' should be an array.");
    }
} catch (error) {
    console.error("Error reading Regulators.json:", error);
    process.exit(1);
}

// Read SanctioningBody.json
const sanctioningBodyPath = path.join(__dirname, "input", "auxiliary", "SanctioningBody.json");
let sanctioningBodyData: any;
try {
    sanctioningBodyData = JSON.parse(fs.readFileSync(sanctioningBodyPath, "utf-8"));
    if (!sanctioningBodyData || !Array.isArray(sanctioningBodyData.sanctioning_body)) {
        throw new Error("Invalid SanctioningBody.json structure: 'sanctioning_body' should be an array.");
    }
} catch (error) {
    console.error("Error reading Regulators.json:", error);
    process.exit(1);
}

// Create a map for bankId to bank name
const bankMap = new Map(bankData.banks.map((bank: any) => [bank.bankId, bank.name]));

// Create a map for regulator
const regulatorMap = new Map(regulatorData.regulators.map((regulator: any) => [regulator.Id, regulator.name, regulator.jurisdiction]));

// // Create a map for sanctioning body
// const sanctioningBodyMap = new Map(sanctioningBodyData.sanctioning_body.map((sanctioning_body: any) => [sanctioning_body.Id, sanctioning_body.name]));


const vaspDirectoryPath = path.join(__dirname, "input", "VASPS");
const vaspFiles = fs.readdirSync(vaspDirectoryPath).filter(file => file.endsWith(".json"));

const accounts: any[] = [];
const vasps: any[] = []; // New array to store VASP data

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

    // Collect main VASP data
    vasps.push({
        vaspId: vaspId,
        commonName: commonName,
        url: vaspData.url || "",
        domiciledCountry: vaspData.domiciledCountry || "",
        hqRegion: vaspData.hqRegion || "",
        isSanctioned: vaspData.isRegulated ? true : false,
        directOnramp: vaspData.directOnramp ? true : false,
        indirectOnramp: vaspData.indirectOnramp ? true : false,
        hasOfframp: vaspData.hasOfframp ? true : false,
        tradesFiat: vaspData.tradesFiat ? true : false,
        tradesPrivacyCoins: vaspData.tradesPrivacyCoins ? true : false,
        isDecentralized: vaspData.isDecentralized ? true : false,
        hasKyc: vaspData.hasKyc ? true : false,
        openedDate: vaspData.openedDate || "",  
        closedDate: vaspData.closedDate || "",
        isCustodial: vaspData.isCustodial ? true : false,
        AML_Policy_URL: vaspData.AML_Policy_URL || ""
    });

    // Collect account data under paymentMethods
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
    isFinancialActionTaskForce: country.isFinancialActionTaskForce ? true : false,
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
vaspFiles.forEach(file => {
    const vaspPath = path.join(vaspDirectoryPath, file);
    let vaspData: any;
    try {
        vaspData = JSON.parse(fs.readFileSync(vaspPath, "utf-8"));
        if (!vaspData || !vaspData.vaspId || !vaspData.commonName) {
            throw new Error(`Invalid structure in ${file}: Missing 'vaspId' or 'commonName'.`);
        }
        vaspMap.set(vaspData.vaspId, vaspData.commonName); // Store vaspId -> commonName
    } catch (error) {
        console.error(`Error reading ${file}:`, error);
    }
});

// Now, process the VASP files again and extract payment methods
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
        return;
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;

    if (vaspData.paymentMethods) {
        vaspData.paymentMethods.forEach((paymentMethod: any) => {
            const onrampProviderId = paymentMethod.onrampProvider || "";
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
    console.log("Regulators.json loaded:", regulatorsData); // Debug log

    // Ensure the file has the expected structure
    if (!regulatorsData || !Array.isArray(regulatorsData.regulators)) {
        throw new Error("Invalid structure: 'regulators' key is missing or not an array.");
    }

    // Populate regulatorMap using the nested array
    regulatorsData.regulators.forEach((regulator: any) => {
        if (regulator.regulatorId) {
            regulatorMap.set(regulator.regulatorId, {
                name: regulator.name ?? "",
                jurisdiction: regulator.jurisdiction ?? ""
            });
        }
    });

    console.log("Regulator Map:", regulatorMap); // Debug log
} catch (error) {
    console.error(`Error reading Regulators.json:`, error);
    process.exit(1);
}

// Array to store the regulations data
const regulators: any[] = [];

// Process each VASP.json file to extract regulations data
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
        return;
    }

    const vaspId = vaspData.vaspId;
    const commonName = vaspData.commonName;
    const openedDate = vaspData.openedDate;
    const closedDate = vaspData.closedDate;

    if (vaspData.regulations) {
        vaspData.regulations.forEach((regulation: any) => {
            const regulatorDetails = regulatorMap.get(regulation.regulator) as { name: string; jurisdiction: string } || { name: "", jurisdiction: "" };

            console.log(`Matching Regulator: ${regulation.regulator}`, regulatorDetails); // Debug log

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

    if (vaspData.tradingPairs) {
        vaspData.tradingPairs.forEach((tradingPair: TradingPairs) => {
            tradingPairs.push({
                tradingPairId: tradingPair.tradingPairId || "",
                vaspId: vaspId,
                commonName: commonName,  // Correctly use commonName for VASP_NAME
                from: tradingPair.from || "",
                From_chain: tradingPair.From_chain || "",
                to: tradingPair.to || "",
                To_chain: tradingPair.To_chain || "",
                Is_Privacy: tradingPair.Is_Privacy ? true : false,
                Is_Fiat: tradingPair.Is_Fiat ? true : false
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

    if (vaspData.kyc) {
        vaspData.kyc.forEach((kyc: Kyc) => {
            kycData.push({
                kycId: kyc.kycId || "",
                vaspId: vaspId,
                commonName: commonName,  // Correctly use commonName for VASP_NAME
                requires2fa: kyc.requires2fa ? true : false,
                legalNameRequired: kyc.legalNameRequired ? true : false,
                dobRequired: kyc.dobRequired ? true : false,
                addressRequired: kyc.addressRequired ? true : false,
                ssn_tinRequired: kyc.ssn_tinRequired ? true : false,
                countryOfCitizenshipRequired: kyc.countryOfCitizenshipRequired ? true : false,
                govtIdRequired: kyc.govtIdRequired ? true : false,
                proofOfResidencyRequired: kyc.proofOfResidencyRequired ? true : false,
                emailRequired: kyc.emailRequired ? true : false,
                phoneRequired: kyc.phoneRequired ? true : false,
                selfieRequired: kyc.selfieRequired ? true : false,
                videoRequired: kyc.videoRequired ? true : false,
                transactionLimitsExist: kyc.transactionLimitsExist ? true : false,
                amountLimit: kyc.amountLimit ? true : false,
                currency: kyc.currency || "",
                limitFrequency: kyc.limitFrequency ? true : false,
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
    console.log("✅ Sanctioning_Body.json loaded:", vaspSanctioningBodyData); // Debug log

    // Ensure the file has the expected structure
    if (!vaspSanctioningBodyData || !Array.isArray(vaspSanctioningBodyData.sanctioning_body)) {
        throw new Error("❌ Invalid structure: 'sanctioning_body' key is missing or not an array.");
    }

    // Populate sanctioningBodyMap using the nested array
    vaspSanctioningBodyData.sanctioning_body.forEach((body: any) => {
        if (body.sanctioningBodyId && body.name) { // ✅ Only add valid entries
            sanctioningBodyMap.set(body.sanctioningBodyId, body.name);
        }
    });

    console.log("✅ Sanctioning_Body Map:", sanctioningBodyMap); // Debug log
} catch (error) {
    console.error(`❌ Error reading Sanctioning_Body.json:`, error);
    process.exit(1);
}

// Array to store the Sanctions data
const sanctionsData: any[] = [];

// Read Vasp_Sanctions.json
const vaspSanctionsPath = path.join(__dirname, "input", "auxiliary", "Vasp_Sanctions.json");
let vaspSanctionData: { sanctions: Sanctions[] };

try {
    vaspSanctionData = JSON.parse(fs.readFileSync(vaspSanctionsPath, "utf-8"));
    if (!vaspSanctionData || !Array.isArray(vaspSanctionData.sanctions)) {
        throw new Error("Invalid Vasp_Sanctions.json structure: 'sanctions' should be an array.");
    }
} catch (error) {
    console.error("Error reading Vasp_Sanctions.json:", error);
    process.exit(1);
}

console.log("✅ Extracted sanctions data:", vaspSanctionData.sanctions);

// Create a map for quick lookup of common names by vaspId
const vaspCommonNameMap: Map<string, string> = new Map();

// Process each VASP.json file to build the vaspCommonNameMap
vaspFiles.forEach(file => {
    const vaspPath = path.join(vaspDirectoryPath, file);
    
    try {
        const vaspData = JSON.parse(fs.readFileSync(vaspPath, "utf-8"));
        
        if (vaspData?.vaspId && vaspData?.commonName) {
            vaspCommonNameMap.set(vaspData.vaspId, vaspData.commonName);
        }
    } catch (error) {
        console.error(`Error reading ${file}:`, error);
        return; // Skip this file and continue with the next one
    }
});

console.log("✅ Extracted common names:", vaspCommonNameMap);

// Process each sanction entry
vaspSanctionData.sanctions.forEach(sanction => {
    const sanctioningBodyName = sanctioningBodyMap.get(sanction.Sanctioning_Body) || "";
    const commonName = vaspCommonNameMap.get(sanction.Vasp) || "";

    // Only add if either name or commonName is found
    if (sanctioningBodyName || commonName) {
        sanctionsData.push({
            Vasp_sanction_ID: sanction.Vasp_sanction_ID || "",
            Vasp: sanction.Vasp || "",
            commonName: commonName,
            Sanctioning_Body: sanction.Sanctioning_Body || "",
            name: sanctioningBodyName,
            Sanction_URL: sanction.Sanction_Url || "",
            Sanction_Type: sanction.Sanction_Type || "",
            Sanction_start: sanction.Sanction_start || "",
            Sanction_end: sanction.Sanction_end || "",
        });
    }
});

// Check if there is data to write to CSV
if (sanctionsData.length === 0) {
    console.error("No sanctions data found to write to CSV.");
    process.exit(1);
}

// Write to Sanctions.csv
sanctionsPairsCsvWriter.writeRecords(sanctionsData)
    .then(() => console.log("✅ Sanctions.csv has been written successfully."))
    .catch(error => console.error("❌ Error writing Sanctions.csv:", error));
