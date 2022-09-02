const fs = require("fs/promises");
const generateCodes = async () => {
  await fs.mkdir("./public/pages", {});
  await Promise.all(
    ["ssr", "ssg"].map((p) =>
      fs.copyFile(`./pages/${p}.js`, `./public/pages/${p}.js`)
    )
  );
};

generateCodes();
