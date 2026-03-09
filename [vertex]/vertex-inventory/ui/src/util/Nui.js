// Check if we're in FiveM environment (has GetParentResourceName)
const isFiveMEnvironment = typeof GetParentResourceName === 'function';

// Mock response for development mode
const createMockResponse = () => ({
  ok: true,
  status: 200,
  json: async () => ({}),
  text: async () => '',
  headers: new Headers(),
});

export default {
  send(event, data = {}) {
    /* eslint-disable no-unreachable */
    // In development mode outside FiveM, return mock response
    if (process.env.NODE_ENV !== 'production' && !isFiveMEnvironment) {
      console.warn(`[DEV] Nui.send('${event}') - FiveM NUI callback not available in browser`, data);
      return Promise.resolve(createMockResponse());
    }

    // Return fetch promise with error handling for development
    return fetch(`https://vertex-inventory/${event}`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      // Handle fetch errors gracefully in development
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[DEV] Nui.send('${event}') failed:`, error);
        return createMockResponse();
      }
      throw error;
    });
    /* eslint-enable no-unreachable  */
  },
  emulate(type, data = null) {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type,
          data,
        },
      }),
    );
  },
};
