import "./vendor/needsharebutton.js";
import "./vendor/needsharebutton.css";
import "./vendor/github-badge.js";

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
