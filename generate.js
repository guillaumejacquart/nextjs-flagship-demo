const fs = require("fs/promises");
const generateCodes = () => {
  ["ssr", "ssg"].map((p) =>
    fs.copyFile(`./pages/${p}.js`, `./public/pages/${p}.js`)
  );
};

generateCodes();
