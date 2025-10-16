module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
    },
    rules: {
        semi: ["error", "always"], // * Табуляция
        quotes: ["error", "double"], // * Одинарные кавычки
        "@typescript-eslint/no-explicit-any": "warn", // * Предупреждение при использовании типа "any"
        "prettier/prettier": [
            "error",
            {
                tabs: false, // * Табуляция
                semi: true, // * Табуляция
                singleQuote: false, // * Одинарные кавычки
                endOfLine: "lf", // * Окончание строки
                trailingComma: "all", // * Треугольные скобки
                printWidth: 100, // * Ширина консоли
                tabWidth: 4, // * Количество пробелов в табуляции
                bracketSpacing: true, // * Отступы между скобками
                arrowParens: "always", // * Скобки в стрелках
            },
        ], // * Настройки Prettier

        "@typescript-eslint/no-unused-vars": "off", // * Неиспользуемые переменные
    },
    ignorePatterns: ["migrations"],
};
