import '@testing-library/jest-dom';

// import.meta is unavailable under Jest, so stub the env-derived config.
jest.mock('./config', () => ({ API_URL: 'http://api.test/api' }));
