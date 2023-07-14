import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { renderTemplate, readTemplateProject } from "../templates/index.mjs";
import AdmZip from "adm-zip";
import fs from "fs";

const router = express.Router();

function addFilesToZip(dirents, formData, zip, currentDir) {
  dirents.forEach((element) => {
    let urlPath = element.path + "/" + element.name;
    if (element.isDirectory()) {
      let direntsSubDir = fs.readdirSync(urlPath, {
        withFileTypes: true,
      });
      addFilesToZip(
        direntsSubDir,
        formData,
        zip,
        currentDir + element.name + "/"
      );
    } else if (element.name.endsWith(".ejs")) {
      zip.addFile(
        currentDir + element.name.replace(/\.[^\.]+$/, ""),
        Buffer.from(renderTemplate(urlPath, formData), "utf8")
      );
    } else {
      console.log("Adicioando arquivo estático: " + element.name);
      zip.addLocalFile(urlPath, currentDir, element.name);
    }
  });
}

// Get a list of 50 cadastros
router.get("/:id", async (req, res) => {
  let collection = await db.collection("cadastros");
  let query = { _id: new ObjectId(req.params.id) };
  let formData = await collection.findOne(query);

  if (!formData) {
    res.send("Not found").status(404);
  } else {
    console.log(formData);
    let dirents = readTemplateProject("projeto-exemplo");

    let zip = new AdmZip();

    addFilesToZip(dirents, formData, zip, "./");

    res.attachment(req.params.id + ".zip");
    res.send(zip.toBuffer()).status(200);
  }
});

export default router;
