const fs = require("fs");

let newFile = null;
fs.readFile("./dist/index.d.ts", "utf8", (err, data) => {
  newFile = data.replace(/(?<!export\s*)declare/g, "export declare");
  if (err) {
    console.error(err);
  }
  if (newFile != data) {
    console.log(newFile);
    fs.writeFileSync("./dist/index.d.ts", newFile, (err) => {
      console.error(err);
    });
  } else {
    console.log("files have exports");
  }
});
