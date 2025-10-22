const pnlBase =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4567"
    : "https://pnl.dev";

class ErrorResponse extends Error {
  constructor(msg, details) {
    super(msg);
    this.details = details;
  }
}

export default {
  async handleResponse(response) {
    const responseData = await response.json();
    if (responseData?.error) {
      throw new ErrorResponse(responseData.error, responseData);
    }
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return responseData;
  },
  async post(url, data) {
    const response = await fetch(pnlBase + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return this.handleResponse(response);
  },
  async delete(url, data) {
    const response = await fetch(pnlBase + url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return this.handleResponse(response);
  },

  async get(url, queryParams) {
    const response = await fetch(
      pnlBase + url + "?" + new URLSearchParams(queryParams),
      {
        method: "GET",
        credentials: "include",
      }
    );
    return this.handleResponse(response);
  },

  async ttsSpeak({ text, lang, voice }) {
    const response = await fetch(pnlBase + "/api/tts/speak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, lang, voice }),
      credentials: "include",
    });
    if (!response.ok) {
      const data = await response.json();
      const errorMessage = data?.error || response.statusText;
      console.error(response.status, "TTS failed:", errorMessage);
      throw new ErrorResponse(errorMessage, data);
    }
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return { audio: Array.from(new Uint8Array(arrayBuffer)) };
  },
};
