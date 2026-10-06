import "./vendor/needsharebutton.js";
import "./vendor/needsharebutton.css";
import "./vendor/github-badge.js";
import QRCode from "qrcode";

const productName = "PNL Reader";
document.title = `Share - ${productName}`;
const { version } = chrome.runtime.getManifest();

const pnlBase =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4567"
    : "https://pnl.dev";

async function getCurrentCoupon() {
  const res = await fetch(`${pnlBase}/api/pro`, { credentials: "include" });
  if (res.ok) {
    const data = await res.json();
    return data.currentCoupon;
  }
}

const setupAppDescription = () => {
  document.querySelector("#app-version").innerText = `v${version}`;
  document
    .querySelectorAll(".productName")
    .forEach((el) => (el.innerText = productName));
};
setupAppDescription();

const setupDealOfferBanner = async () => {
  document.querySelector("#launch-deal-banner").style.display = "none";
  const currentCoupon = await getCurrentCoupon().catch(() => null);
  if (currentCoupon) {
    document.querySelector("#launch-deal-banner").style.display = "block";
    document.querySelector(".coupon-name").innerText = currentCoupon.name;
    document.querySelector(".percent-off").innerText =
      currentCoupon.percent_off;
  }
};
setupDealOfferBanner();

// QR codes for the Puffins download links, rendered locally.
document.querySelectorAll("canvas[data-qr]").forEach((canvas) => {
  QRCode.toCanvas(canvas, canvas.dataset.qr, { width: 120, margin: 1 }).catch(
    () => {
      canvas.closest(".qr").style.display = "none";
    },
  );
});
