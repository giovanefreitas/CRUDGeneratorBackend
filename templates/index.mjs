import ejs from "ejs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function renderTemplate(templatePath, context) {
  let ret = ejs.compile(fs.readFileSync(templatePath, "utf8"), {
    filename: templatePath,
  })(context);

  return ret;
}

function readTemplateProject(templateProject) {
  //TODO: mudar para readdir e fazer esta função retornar uma Promise ou preferencialmente um stream
  return fs
    .readdirSync(
      path.join(__dirname, "projects-templates/" + templateProject),
      { withFileTypes: true }
    );
}

export { renderTemplate, readTemplateProject };
