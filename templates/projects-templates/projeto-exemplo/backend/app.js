const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const createDebug = require("debug");

const debug = createDebug("debug");
const info = createDebug("info");
const error = createDebug("error");

const indexRouter = require("./routes/index.js");

const app = express();

app.use(morgan("tiny", { stream: { write: (msg) => info(msg.trimEnd()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const whitelist = ["http://localhost:3000/", "http://140.238.183.110"];
const corsOptions = {
  origin(origin, callback) {
    debug(`MODE=${process.env.NODE_ENV} from ${origin}`);
    if (
      !origin ||
      process.env.NODE_ENV === "development" ||
      whitelist.indexOf(origin) !== -1
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(helmet());

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  error("Erro não tratado: ", err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ erro: err });
});

module.exports = app;
