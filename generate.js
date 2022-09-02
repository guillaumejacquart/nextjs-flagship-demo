const fs = require("fs/promises");
const outputPath = "./public/pages"
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
};

generateCodes();
