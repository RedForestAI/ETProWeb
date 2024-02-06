// __mocks__/fetch.js or directly in your test file

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'This is a test response' }),
  })
);
