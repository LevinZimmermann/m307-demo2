import { createApp, upload } from "./config.js";

const app = createApp({
  user: "lenlev",
  host: "bbz.cloud",
  database: "lenlev",
  password: "n$3DAzX?HctSJCs_",
  port: 30211,
});

/////////////////* Startseite *//////////////
app.get("/", (req, res) => {
  res.render("start");
});
s
// Gallery
app.get("/gallery", async (req, res) => {
  const uploads = await app.locals.pool.query("SELECT * FROM uploads");
  res.render("gallery", { uploads: uploads.rows });
});

// Startseite New Posts
app.get("/new_post", (req, res) => {
  res.render("new_post");
});

////////////////////////////////

// Impressum
app.get("/impressum", (req, res) => {
  res.render("impressum");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
