const fs = require("fs");
const path = require("path");

module.exports = ({
  sourceFile,
  sourceFiles = [],
  destDir,
  watchMode = true,
}) => {
  if (!fs.existsSync(destDir)) {
    console.warn(
      `⚠️ Destination directory does not exist: ${destDir}, skipping copy-on-change.`
    );
    return;
  }

  function copyFile(filepath) {
    try {
      const destFile = path.join(destDir, path.basename(filepath));
      fs.copyFileSync(path.resolve(filepath), destFile);
      console.log(`✅ Copied ${filepath} to ${destFile}`);
    } catch (error) {
      console.error(`❌ Copy failed:`, error);
    }
  }

  function watchFile(filepath) {
    fs.watchFile(filepath, () => {
      console.log(`📁 ${filepath} changed`);
      copyFile(filepath);
    });

    console.log(`👀 Watching ${filepath} for changes...`);
  }

  // Initial copy
  if (sourceFile) copyFile(sourceFile);
  sourceFiles.forEach((file) => copyFile(file));

  // Watch for changes
  if (watchMode) {
    if (sourceFile) watchFile(sourceFile);
    sourceFiles.forEach((file) => watchFile(file));
  }
};
