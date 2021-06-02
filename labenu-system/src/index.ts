import express, { Request, Response } from "express"
import knex from "knex"
import cors from "cors"
import dotenv from "dotenv"
import { AddressInfo } from "net"
import { convertDate } from "./function"

dotenv.config()

export const connection = knex({
   client: "mysql",
   connection: {
      host: process.env.DB_HOST,
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
   }
}) 

const app = express()
app.use(express.json())
app.use(cors())

app.post("/class/insert", async (req: Request, res: Response) => {
   try{
      
      const {nome, data_de_inicio, data_de_encerramento, modulo} = req.body

   
      if (!nome || !data_de_inicio || !data_de_encerramento || (!modulo && modulo !== 0)){
         throw new Error ("Forneça corretamente o nome, data_de_inicio, data_de_encerramento e modulo")
      }

      const result = await connection.raw(`INSERT INTO CLASS 
      (nome, data_de_início, data_de_encerramento, modulo) VALUES(
         "${nome}",
         "${convertDate(data_de_inicio)}",
         "${convertDate(data_de_encerramento)}",
         ${modulo}
      )`)
      
      res.send({message: "Turma criada com sucesso!", status: 1})
      
   }catch (err){
      res
      .status(400)
      .send({ message: err.message, status: 0 })
   }
   
});  

app.post ("/teachers/insert", async (req:Request, res:Response) => {
   try{

      const { nome, email, data_de_nascimento, turma } = req.body

      if(!nome || !email || !data_de_nascimento || !turma){
         throw new Error ("Forneça corretamente nome, email, data_de_nascimento, turma")
      }

      const result = await connection.raw(`INSERT INTO TEACHERS
      (nome, email, data_de_nascimento, turma) VALUES (
         "${nome}",
         "${email}",
         "${convertDate(data_de_nascimento)}",
         ${turma}
      )`)

      res.send({message: "Professor inserindo com sucesso!", status: 1 })

   }catch(err){
      res
      .status(400)
      .send({ message: err.message, status: 0 })
   }

});

app.post ("/students/insert", async (req: Request, res: Response) => {
   try{

      const { nome, email, data_de_nascimento, turma } = req.body

      if (!nome || !email || !data_de_nascimento || !turma){
         throw new Error("Forneça Corretamente nome, email, data_de_nascimento, turma")
      }

      const result = await connection.raw(`INSERT INTO STUDENTS
      (nome, email, data_de_nascimento, class_id) VALUES(
         "${nome}",
         "${email}",
         "${convertDate(data_de_nascimento)}",
         ${turma}
      )`)

      res.send({ message: "Aluno inserido com sucesso!", status: 1 })

   }catch(err){
      res
      .status(400)
      .send({ message: err.message, status: 0 })
   }
})


const server = app.listen(process.env.PORT || 3003, () => {
   if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Server is running in http://localhost:${address.port}`);
   } else {
      console.error(`Failure upon starting server.`);
   }
})