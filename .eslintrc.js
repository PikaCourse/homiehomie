// eslint-disable-next-line no-undef
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "plugin:react/recommended",
    "eslint:recommended",
  ],
  "parser": "babel-eslint",
  "plugins": [
    "react",
  ],
  "rules": {
    // enable additional rules
    "indent": ["warn", 2,],
    "linebreak-style": ["warn", "unix",],
    "quotes": ["warn", "double",],
    "semi": ["warn", "always",],
    "no-unused-vars": "warn",
    "react/prop-types": "warn",

    // override default options for rules from base configurations
    "comma-dangle": ["off", "always",],
    "no-cond-assign": ["warn", "always",],

    // disable rules from base configurations
    "no-console": "off",
  },
};
