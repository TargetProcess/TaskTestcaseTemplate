module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "modules": true
        }
    },

    "plugins": [
        "react"
    ],

    "extends": [
        "eslint:all",
        "plugin:react/all"
    ],

    "env": {
        "browser": true,
        "node": true,
        "amd": false,
        "es6": true
    },

    "settings": {
        "react": {
            "version": "15.4"
        }
    },

    "rules": {
        "no-extra-parens": "off",
        "no-magic-numbers": ["error", {"ignore": [0, 1]}],
        "no-plusplus": "off",
        "no-process-env": "off",
        "no-ternary": "off",
        "no-var": "off",
        "no-void": "off",

        "capitalized-comments": "off",
        "dot-location": ["error", "property"],
        "func-names": "off",
        "id-length": "off",
        "indent": ["error", 4, {"SwitchCase": 1}],
        "init-declarations": "off",
        "linebreak-style": ["off", "unix"],
        "max-len": ["error", 120, 4],
        "multiline-ternary": "off",
        "newline-after-var": "off",
        "newline-before-return": "off",
        "object-curly-newline": ["off", {"multiline": true}],
        "object-property-newline": ["error", { "allowMultiplePropertiesPerLine": true }],
        "object-shorthand": "warn",
        "one-var": ["error", "never"],
        "operator-linebreak": ["error", "after"],
        "padded-blocks": ["warn", "never"],
        "prefer-arrow-callback": "warn",
        "prefer-destructuring": "off",
        "quote-props": ["warn", "as-needed"],
        "quotes": ["error", "single", {"allowTemplateLiterals": true}],
        "sort-imports": "off",
        "sort-keys": "off",
        "space-before-function-paren": ["error", "never"],
        "vars-on-top": "off",

        "react/jsx-filename-extension": "off",
        "react/jsx-max-props-per-line": "off",
        "react/jsx-no-literals": "off",
        "react/jsx-sort-props": "warn",

        /*
        "no-catch-shadow": "off",
        "no-continue": "off",
        "no-else-return": "off",
        "no-inline-comments": "off",
        "no-invalid-this": "warn",
        "no-param-reassign": ["warn", {"props": true}],
        "no-restricted-modules": "off",
        "no-restricted-syntax": "off",
        "no-shadow": "warn",
        "no-sync": "off",
        "no-warning-comments": ["off", {"terms": ["todo", "fixme", "xxx"], "location": "start"}],

        "accessor-pairs": "off",
        "complexity": ["off", 6],
        "generator-star-spacing": "off",
        "lines-around-comment": "off",
        "max-depth": ["off", 3],
        "max-params": ["off", 3],
        "max-statements": ["off", 10],
        "prefer-reflect": "off",
        "prefer-template": "warn",
        "id-match": "off",
        "require-jsdoc": "off",
        "sort-vars": "off",
        "strict": "off",
        "valid-jsdoc": "off",
        "wrap-regex": "off",

        "react/forbid-prop-types": "off",
        "react/jsx-closing-bracket-location": "warn",
        "react/no-did-mount-set-state": "off",
        "react/no-set-state": "off",
        "react/prefer-es6-class": "warn",
        "react/prop-types": "warn",
        "react/require-extension": "off",
        "react/sort-comp": ["error", {"order": ["lifecycle", "render", "/^render.+$/", "/^handle.+$/", "everything-else"]}],
        */
    }
};
