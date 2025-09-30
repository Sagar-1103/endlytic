import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mediaRouter from "./routes/media.routes";
import queryRouter from "./routes/query.routes";
dotenv.config();

const app:Express = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({success:true,message:"Endlytic gateway running..."})
})

app.use("/upload",mediaRouter);
app.use("/query",queryRouter);

app.listen(PORT,()=>{
    console.log(`Gateway running on port ${PORT}`);
})