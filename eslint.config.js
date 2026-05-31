import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      // Surfaced as warnings rather than errors: the codebase intentionally
      // uses `any` for third-party globals (analytics, cookies) and canonical
      // snippets (the GA `arguments` shim, the Tailwind `require()` plugin).
      // Keeping them visible without failing the CI lint gate.
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-rest-params": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      // shadcn/ui generated components use empty interfaces that extend a
      // native element's props (a documented extension point).
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  }
);
