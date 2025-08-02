const { writeFileSync, mkdirSync } = require("fs");
// require("dotenv").config();

try {
  const targetPath = "./src/environments/environment.ts";
  const targetPathDev = "./src/environments/environment.development.ts";

  const productionEnv = process.env["PRODUCTION"];

  if (!productionEnv) {
    throw new Error("PRODUCTION environment variable is not defined");
  }

  mkdirSync("./src/environments", { recursive: true });

  const envFileContent = `
  export const environment = {
    production: ${process.env.PRODUCTION_PROD},
    apiUrl: "${process.env.API_URL_PROD}",
    version: "${process.env.VERSION}",
    darkMode: "${process.env.DARK_MODE}",
    lightMode: "${process.env.LIGHT_MODE}",
    STORAGE_KEY: "${process.env.STORAGE_KEY}",
    timeSuccessModal: ${process.env.TIME_SUCCESS_MODAL},
    STORAGE_KEY_AUTH: "${process.env.STORAGE_KEY_AUTH}",
    SECRET_KEY_JWT: "${process.env.SECRET_KEY_JWT}",
    TOAST_TIME: ${process.env.TOAST_TIME},
    REDIRECT_TIME: ${process.env.REDIRECT_TIME},
    MY_FRONTEND_URL_REDIRECT: "${process.env.MY_FRONTEND_URL_REDIRECT_PROD}",
    DIRECT_LINK: ${process.env.DIRECT_LINK},
    };
    `;

  const envFileContentDev = `
    export const environment = {
      production: ${process.env.PRODUCTION},
      apiUrl: "${process.env.API_URL}",
      version: "${process.env.VERSION}",
      darkMode: "${process.env.DARK_MODE}",
      lightMode: "${process.env.LIGHT_MODE}",
      STORAGE_KEY: "${process.env.STORAGE_KEY}",
      timeSuccessModal: ${process.env.TIME_SUCCESS_MODAL},
      STORAGE_KEY_AUTH: "${process.env.STORAGE_KEY_AUTH}",
      SECRET_KEY_JWT: "${process.env.SECRET_KEY_JWT}",
      TOAST_TIME: ${process.env.TOAST_TIME},
      REDIRECT_TIME: ${process.env.REDIRECT_TIME},
      MY_FRONTEND_URL_REDIRECT: "${process.env.MY_FRONTEND_URL_REDIRECT}",
      DIRECT_LINK: ${process.env.DIRECT_LINK},
      };
      `;

  writeFileSync(targetPath, envFileContent);
  writeFileSync(targetPathDev, envFileContentDev);
} catch (error) {
  console.error("Error generating environment files:", error);
  process.exit(1);
}
