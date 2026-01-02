const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

// Tabelas
db.run(`CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY, usuario TEXT, senha TEXT)`);
db.run(`CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, preco REAL, estoque INTEGER, imagem TEXT)`);
db.run(`CREATE TABLE IF NOT EXISTS pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT, produto TEXT, preco REAL, cliente TEXT)`);

// Admin padrão
db.run(`INSERT OR IGNORE INTO admin VALUES (1,'admin','1234')`);

app.post("/login", (req,res)=>{
  const {usuario,senha}=req.body;
  db.get("SELECT * FROM admin WHERE usuario=? AND senha=?",[usuario,senha],(e,row)=>{
    row ? res.json({ok:true}) : res.status(401).json({ok:false});
  });
});

app.get("/produtos",(req,res)=>{
  db.all("SELECT * FROM produtos",(e,rows)=>res.json(rows));
});

app.post("/produtos",(req,res)=>{
  const {nome,preco,estoque,imagem}=req.body;
  db.run("INSERT INTO produtos (nome,preco,estoque,imagem) VALUES (?,?,?,?)",
  [nome,preco,estoque,imagem]);
  res.sendStatus(200);
});

app.post("/comprar",(req,res)=>{
  const {produto,preco,cliente}=req.body;
  db.run("INSERT INTO pedidos (produto,preco,cliente) VALUES (?,?,?)",
  [produto,preco,cliente]);
  res.sendStatus(200);
});

app.get("/pedidos",(req,res)=>{
  db.all("SELECT * FROM pedidos",(e,rows)=>res.json(rows));
});

app.listen(3000,()=>console.log("Servidor rodando"));
