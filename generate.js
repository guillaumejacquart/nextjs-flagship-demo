const fs = require("fs/promises");
const fetch = require("node-fetch");
const outputPath = "./public/pages";
const envId = "blvo2kijq6pg023l8ee0";

const generateCodes = async () => {
  try {
    await fs.access(outputPath);
  } catch (e) {
    await fs.mkdir(outputPath, {});
  }
  const pages = await fs.readdir("./pages", { withFileTypes: true });
  await Promise.all(
    pages
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name)
      .map((p) => fs.copyFile(`./pages/${p}`, `${outputPath}/${p}`))
  );
  await fs.copyFile(`./middleware.js`, `${outputPath}/middleware.js`);
};

const getBucketingFile = async () => {
  const data = await fetch(
    `https://cdn.flagship.io/${envId}/bucketing.json`
  ).then((r) => r.text());
  await fs.writeFile("./bucketing.json", data);
};

generateCodes().then(getBucketingFile);
