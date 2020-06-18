const { override, addLessLoader } = require("customize-cra");

module.exports = override(
  addLessLoader({
    // If you are using less-loader@5 or older version, please spread the lessOptions to options directly.
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        "@base-color": "#607d8b",
        "@font-family-base": "'Open Sans', 'Montserrat', sans-serif;",
      },
    },
  })
);
