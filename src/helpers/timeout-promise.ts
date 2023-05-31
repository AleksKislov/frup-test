// after 10 seconds, the promise will be rejected
export const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(false), 10000));
