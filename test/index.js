"use strict"
const XmlPaser = require("../")
const FS = require("fs")


const raw = FS.readFileSync("./sample.xml", {encoding: "utf-8"})

// console.log(raw)
console.log(XmlPaser(raw))