import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";

import bbz307 from "bbz307";

export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);

  const login = new bbz307.Login(
    "users",
    ["benutzername", "passwort", "profilbild"],
    pool
  );

  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  app.locals.pool = pool;

  //Register

  app.get("/register", (req, res) => {
    res.render("register");
  });

  app.post("/register", function (req, res) {
    var password = bcrypt.hashSync(req.body.password, 10);
    pool.query(
      "INSERT INTO users (name, username, password) VALUES ($1, $2, $3)",
      [req.body.name, req.body.username, password],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        res.redirect("/login");
      }
    );
  });

  app.get("/login", function (req, res) {
    res.render("login");
  });

  app.post("/login", function (req, res) {
    pool.query(
      "SELECT * FROM users WHERE username = $1",
      [req.body.username],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        if (bcrypt.compareSync(req.body.password, result.rows[0].password)) {
          req.session.userid = result.rows[0].id;
          res.redirect("/");
        } else {
          res.redirect("/login");
        }
      }
    );
  });

  ////

  app.get("/event_formular", function (req, res) {
    res.render("event_formular");
  });

  //Upload Formular
  app.post("/gallery", upload.single("image"), async function (req, res) {
    const date = new Date();
    await app.locals.pool.query(
      "INSERT INTO uploads (title, location, datum, image) VALUES ($1, $2, $3, $4)",
      [req.body.title, req.body.location, date, req.file.filename]
    );
    res.redirect("/");
  });

  return app;
}

export { upload };
