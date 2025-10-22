const listeners = {};

export default {
  handle: (request, sender, sendResponse) => {
    // console.log("handle message", request.type, request);
    if (request.type in listeners) {
      const ret = listeners[request.type](request, sender);
      if (ret?.then) {
        ret.then(sendResponse).catch((err) => {
          console.error(
            `[message] ${request.type} failed: ${err.message}`,
            err,
            request
          );
          sendResponse({ error: err.message, ...err.details });
        });
      } else {
        sendResponse(ret);
      }
    }
  },

  on: (type, callback) => {
    listeners[type] = callback;
  },
};
