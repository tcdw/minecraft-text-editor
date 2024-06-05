import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...fixupConfigRules(pluginReactConfig),
    {
        rules: {
            // https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    eslintPluginPrettierRecommended,
];
