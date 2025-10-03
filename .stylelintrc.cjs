module.exports = {
  extends: ["stylelint-config-standard-scss"],
  plugins: ["stylelint-order"],
  ignoreFiles: ["**/node_modules/**", "**/.next/**"],
  rules: {
    "order/order": [
      "custom-properties",
      "dollar-variables",
      { type: "at-rule", name: "include" },
      "declarations",
      { type: "at-rule", name: "media" },
      "rules",
    ],
    "order/properties-order": [],
    "color-function-notation": "modern",
    "property-no-vendor-prefix": true,
    "value-keyword-case": null,
    "selector-class-pattern": null,
  },
};
