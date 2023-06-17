import fs from "fs";
import { glob } from "glob";
import archiver from "archiver";

const distFolder = "dist";
const archiveFilename = "extension.zip";

const archive = archiver("zip", {
  zlib: { level: 9 },
});

const output = fs.createWriteStream(`${distFolder}/${archiveFilename}`);
output.on("close", () => {
  console.log(`Archive "${output.path}" finished.`);
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);
(
  await glob(`${distFolder}/**`, {
    nodir: true,
    ignore: {
      ignored: (path) => {
        return path.relative() === `${distFolder}/${archiveFilename}`;
      },
    },
  })
).forEach((entry) => {
  console.log(`Adding ${entry}`);
  archive.append(fs.createReadStream(entry), {
    name: entry.substring(`${distFolder}/`.length),
  });
});
archive.finalize();
