import message from "./message.js";
import defaultSiteCustomizations from "./defaultSiteCustomizations.js";

const STORAGE_KEY = "pnlReaderSiteCustomizations";

/**
 * Get all site customizations.
 * Only loads defaults if storage is null/undefined.
 * @returns {Promise<Array>} Array of site customizations
 */
export async function getSiteCustomizations() {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (data) => {
      const stored = data?.[STORAGE_KEY];
      if (stored) {
        // Filter out ones without name
        resolve(stored.filter((c) => c.name));
      } else {
        resolve(defaultSiteCustomizations);
      }
    });
  });
}

/**
 * Save site customizations to storage.
 * @param {Array} customizations - Array of site customizations
 * @returns {Promise<void>}
 */
async function saveSiteCustomizations(customizations) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: customizations }, resolve);
  });
}

/**
 * Add or update a site customization.
 * Replaces existing customization with the same name.
 * @param {Object} customization - The customization to add
 * @returns {Promise<Array>} Updated array of customizations
 */
export async function addSiteCustomization(customization) {
  const customizations = await getSiteCustomizations();

  // Find index of existing customization with same name
  const existingIndex = customizations.findIndex(
    (c) => c.name && customization.name && c.name === customization.name,
  );

  if (existingIndex !== -1) {
    // Replace existing
    customizations[existingIndex] = customization;
  } else {
    // Add new
    customizations.push(customization);
  }

  await saveSiteCustomizations(customizations);
  return customizations;
}

/**
 * Remove a site customization by name.
 * @param {string} name - The name of the customization to remove
 * @returns {Promise<Array>} Updated array of customizations
 */
export async function removeSiteCustomization(name) {
  const customizations = await getSiteCustomizations();
  const filtered = customizations.filter((c) => c.name !== name);
  await saveSiteCustomizations(filtered);
  return filtered;
}

/**
 * Update all site customizations (bulk replace).
 * @param {Array} customizations - The new array of customizations
 * @returns {Promise<Array>} The saved customizations
 */
export async function updateSiteCustomizations(customizations) {
  await saveSiteCustomizations(customizations);
  return customizations;
}

message.on("get site customizations", async () => {
  return await getSiteCustomizations();
});

message.on("add site customization", async ({ customization }) => {
  return await addSiteCustomization(customization);
});

message.on("remove site customization", async ({ name }) => {
  return await removeSiteCustomization(name);
});

message.on("share site customization", async ({ shareData }) => {
  await chrome.storage.local.set({ siteCustomizationsShareData: shareData });
  return true;
});
