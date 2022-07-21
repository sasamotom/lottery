const keepFolder = require("imagemin-keep-folder");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const gifsicle = require("imagemin-gifsicle");
const svgo = require("imagemin-svgo");
const changed = process.argv[2];
const file =
  changed !== "" && changed ? [changed] : ["./src/assets/images/**/*.*"];

keepFolder(file, {
  plugins: [
    mozjpeg({
      quality: 80,
    }),
    pngquant({
      quality: [0.65, 0.8],
    }),
    gifsicle(),
    svgo(),
  ],
  replaceOutputDir: (output) => {
    return output.replace(/images\//, "../../htdocs/assets/images/");
  },
});
