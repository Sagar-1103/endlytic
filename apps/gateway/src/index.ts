import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mediaRouter from "./routes/media.routes";
import queryRouter from "./routes/query.routes";
dotenv.config();

const app:Express = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin:process.env.CORS_ORIGIN,
}));

app.use(express.json());

app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({success:true,message:"Endlytic gateway running..."})
})

app.use("/upload",mediaRouter);
app.use("/query",queryRouter);

app.listen(PORT,()=>{
    console.log(`Gateway running on port ${PORT}`);
})