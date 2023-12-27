import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js ";
import inboundRoutes from "./routes/inbound.js";
import generalRoutes from "./routes/general.js";
import { register } from "./controllers/auth.js";

/*Configuration*/
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/*POST ROUTES*/
app.post("/auth/register", register);

//Primera Cada vez que acceda a la primera tab, donde van a existir las entradas de datos, voy a establecer los datos que quiero obtener
app.use("/auth", authRoutes);
app.use("/inbound", inboundRoutes);
app.use("/general", generalRoutes);

/*MONGOOSE SETUP*/

const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
