const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

function getAllUpdatedFontsFromZips() {
  const allUpdatedFonts = [];
  const zipDir = __dirname;
  const zipFiles = fs
    .readdirSync(zipDir)
    .filter((file) => file.endsWith(".zip"));
  const fontNameRegex = /^([\w-]+)-v\d+/;
  for (const file of zipFiles) {
    const name = fontNameRegex.exec(file)[1];
    const fontName = name
      .split("-")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
    allUpdatedFonts.push(fontName);
  }
  console.log("Gonna update fonts:", allUpdatedFonts);
  return allUpdatedFonts;
}

async function updateFont(fontName) {
  const filenamePrefix = fontName.toLowerCase().replaceAll(" ", "-") + "-v";

  const removeOldFonts = () => {
    const fontDir = __dirname;
    const fontFiles = fs.readdirSync(fontDir);
    for (const file of fontFiles) {
      if (file.startsWith(filenamePrefix) && file.endsWith(".woff2")) {
        fs.unlinkSync(path.join(fontDir, file));
        console.log("Removed old font file:", file);
      }
    }
  };

  const extractTheFont = () => {
    const zipDir = __dirname;
    const destDir = __dirname;
    const targetFileEnding = "regular.woff2";

    const theZipFile = fs
      .readdirSync(zipDir)
      .find((file) => file.startsWith(filenamePrefix) && file.endsWith(".zip"));

    const zip = new AdmZip(path.join(zipDir, theZipFile));
    const zipEntries = zip.getEntries();
    for (const entry of zipEntries) {
      if (entry.entryName.endsWith(targetFileEnding)) {
        zip.extractEntryTo(entry, destDir, false, true);
        console.log("Extracted font:", entry.entryName);
        return entry.entryName;
      }
    }
  };

  const updateFontSrcInCSS = (newFontFilePath) => {
    const cssFile = path.join(__dirname, "fonts.css");
    const cssContent = fs.readFileSync(cssFile, "utf8");
    const regex = new RegExp(`url\\(.*${filenamePrefix}.*\\.woff2\\"\\)`);
    const updatedCSSContent = cssContent.replace(
      regex,
      `url("${newFontFilePath}")`
    );
    fs.writeFileSync(cssFile, updatedCSSContent);
    console.log("Updated CSS for font:", newFontFilePath);
  };

  removeOldFonts();
  const newFontFileName = extractTheFont();
  const newFontFilePath = "./" + newFontFileName;
  updateFontSrcInCSS(newFontFilePath);
}

function cleanUpFiles() {
  // remove all zip files and .Identifier files
  const zipDir = __dirname;
  const files = fs.readdirSync(zipDir);
  for (const file of files) {
    if (file.endsWith(".zip") || file.endsWith(".Identifier")) {
      fs.unlinkSync(path.join(zipDir, file));
    }
  }
  console.log("Cleaned up all zip files and .Identifier files");
}

function help() {
  console.log("Usage: node extractAndSetFonts.js");
}

const run = async () => {
  const showHelp =
    process.argv.includes("--help") || process.argv.includes("-h");
  if (showHelp) {
    help();
    return;
  }
  const allUpdatedFonts = getAllUpdatedFontsFromZips();
  for (const font of allUpdatedFonts) {
    updateFont(font);
  }
  cleanUpFiles();
};

run().catch(console.error).finally(process.exit);
