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
  function addMessageOnFileTop(filepath) {
    const message = "// This file is auto-copied. Do not edit directly.";
    try {
      const content = fs.readFileSync(filepath, "utf-8");
      if (!content.startsWith(message)) {
        fs.writeFileSync(filepath, message + "\n\n" + content, "utf-8");
        console.log(`✅ Added message to top of ${filepath}`);
      }
    } catch (error) {
      console.error(`❌ Failed to add message to ${filepath}:`, error);
    }
  }

  function copyAndTransform(filepath) {
    try {
      const destFile = path.join(destDir, path.basename(filepath));
      fs.copyFileSync(path.resolve(filepath), destFile);
      console.log(`✅ Copied ${filepath} to ${destFile}`);
      addMessageOnFileTop(destFile);
    } catch (error) {
      console.error(`❌ Copy failed:`, error);
    }
  }

  function watchFile(filepath) {
    fs.watchFile(filepath, () => {
      console.log(`📁 ${filepath} changed`);
      copyAndTransform(filepath);
    });

    console.log(`👀 Watching ${filepath} for changes...`);
  }

  // Initial copy
  if (sourceFile) copyAndTransform(sourceFile);
  sourceFiles.forEach((file) => copyAndTransform(file));

  // Watch for changes
  if (watchMode) {
    if (sourceFile) watchFile(sourceFile);
    sourceFiles.forEach((file) => watchFile(file));
  }
};
