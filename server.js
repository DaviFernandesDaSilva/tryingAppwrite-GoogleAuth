import express from 'express'
import cookieParser from 'cookie-parser';
import createAppwriteClient from "./appwrite.js";
import { OAuthProvider } from 'node-appwrite';

const app = express();
app.use(cookieParser());
const port = 3000;

app.get("/", async (req,res)=>{
    res.send("Google OAuth");
})

app.get("/auth", async (req, res) => {
    try {
        const { account } = await createAppwriteClient("admin");
        const redirectUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            "http://localhost:3000/success",
            "http://localhost:3000/#fail"
        );
        const htmlContent = `<button><a href="${redirectUrl}">Entre com o Google</a></button>`;
        res.set("Content-Type", "text/html");
        res.send(htmlContent);
    } catch (error) {
        console.log("Error:", error);
        res.json({ ERROR: error });
    }
});

app.get("/success", async (req, res) => {
    console.log("triggered success");
    try {
        const { userId, secret } = req.query;

        const { account } = await createAppwriteClient("admin");
        const session = await account.createSession(userId, secret);

        res.cookie("session", session.secret, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(session.expire),
            path: "/",
        });
        return res.json({ message: "Session deu certo!" });
    } catch (error) {
        console.log("Error:", error);
        res.json({ ERROR: error });
    }
});

app.get("/user", async (req,res)=>{
    try{
        const sessionCookie = req.cookies.session;

        if(!sessionCookie){
            return res.send("Você não está logado.. ");
        }

        const { account } = await createAppwriteClient("session", sessionCookie);
        const user = await account.get()
        
        return res.send(`Seja bem-vindo ${user.name}`)
    }catch(err){
        return res.json({err});
    }
})



app.listen(port, ()=>{
    console.log("Server is running");
})