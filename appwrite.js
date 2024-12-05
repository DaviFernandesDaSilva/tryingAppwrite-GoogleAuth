import { Client, Databases, Account } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const createAppwriteClient = async (type, session) => {
    const client = new Client().setEndpoint(process.env.ENDPOINT).setProject(process.env.PROJECT_ID);

    if (type === "admin") {
        client.setKey(process.env.API_KEY);
    }

    if (type === "session" && session) {
        client.setSession(session);
    }

    return {
        get account() {
            return new Account(client);
        },

        get databases() {
            return new Databases(client);
        },
    };
};

export default createAppwriteClient;