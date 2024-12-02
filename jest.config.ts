module.exports = {
  moduleNameMapper: {
    "^swiper/react$": "<rootDir>/__mocks__/swiper/react.tsx",
    "^swiper/modules$": "<rootDir>/__mocks__/swiper/module.tsx",
    "^swiper/css$": "<rootDir>/__mocks__/swiper/css.js",
    "^swiper/css/pagination$": "<rootDir>/__mocks__/swiper/css/pagination.js",
    "\\.(jpg|jpeg|png|svg|css|scss)$": "jest-transform-stub", // Stub other CSS files
  },
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
};
