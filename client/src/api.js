// One small helper for talking to the Express backend.
// Every page uses api.get / api.post / api.put / api.del
async function request(method, url, body) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send the login cookie
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

const api = {
  get: (url) => request("GET", url),
  post: (url, body) => request("POST", url, body),
  put: (url, body) => request("PUT", url, body),
  del: (url) => request("DELETE", url),
};

export default api;

export const CATEGORIES = [
  "Electronics",
  "Books",
  "Sports Equipment",
  "Tools",
  "Kitchen Appliances",
  "Clothing",
  "Others",
];

// Shown when an item has no image or the image link is broken
export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#e6efee"/><text x="300" y="210" font-family="sans-serif" font-size="28" text-anchor="middle" fill="#5b7f7b">No image</text></svg>'
  );

export function formatPrice(price) {
  return price > 0 ? "₹" + price + " / day" : "Free";
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
