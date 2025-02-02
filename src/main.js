import express from "express";
import { updateExcel } from "./utils/updateExcel.js";
const app = new express();
const decoder = new TextDecoder();
const buf = await Deno.readFile("config/config.json");
const settings = JSON.parse(decoder.decode(buf));
console.log(settings);
