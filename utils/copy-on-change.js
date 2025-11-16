const fs = require("fs");
const path = require("path");

module.exports = ({ sourceFile, destDir, watchMode = true }) => {
  if (!fs.existsSync(destDir)) {
    console.warn(
      `⚠️ Destination directory does not exist: ${destDir}, skipping copy-on-change.`
    );
    return;
  }

  function copyFile() {
    try {
      const destFile = path.join(destDir, path.basename(sourceFile));
      fs.copyFileSync(path.resolve(sourceFile), destFile);
      console.log(`✅ Copied ${sourceFile} to ${destFile}`);
    } catch (error) {
      console.error(`❌ Copy failed:`, error);
    }
  }

  // Initial copy
  copyFile();

  // Watch for changes
  if (watchMode) {
    fs.watchFile(sourceFile, () => {
      console.log(`📁 ${sourceFile} changed`);
      copyFile();
    });

    console.log(`👀 Watching ${sourceFile} for changes...`);
  }
};
