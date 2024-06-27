import { Redis } from "ioredis";
import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

const dataSchema = z.object({
    user_id: z.string(),
    input_token: z.number(),
    output_token: z.number(),
});

type Data = z.infer<typeof dataSchema>;

const redis = new Redis();

app.get("/token/:userId", async (req, res) => {
    const userId = req.params.userId;

    const result = await redis.get(`user_${userId}`);
    if (!result) {
        return res.status(404).json({ error: "User not found" });
    }

    const parseResult = dataSchema.safeParse(JSON.parse(result));
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors });
    }

    res.json(parseResult.data);
});

app.post("/token", async (req, res) => {
    const parseResult = dataSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors });
    }

    const data: Data = parseResult.data;
    const previousData = await redis.get(`user_${data.user_id}`);
    let updatedData = { ...data };

    if (previousData) {
        const parsePreviousData = dataSchema.safeParse(JSON.parse(previousData));
        if (!parsePreviousData.success) {
            return res.status(500).json({ error: parsePreviousData.error.errors });
        }
        updatedData = {
            ...data,
            input_token: parsePreviousData.data.input_token + data.input_token,
            output_token: parsePreviousData.data.output_token + data.output_token,
        };
    }

    const result = await redis.set(`user_${data.user_id}`, JSON.stringify(updatedData));
    res.json({ result });
});

app.delete("/token/:userId", async (req, res) => {
    const userId = req.params.userId;

    const isUserExisted = await redis.get(`user_${userId}`);
    if (!isUserExisted) {
        return res.status(404).json({ error: "User not found" });
    }

    const deleteResult = await redis.del(`user_${userId}`);
    res.json({ deleteResult });
});

app.listen(4250, () => {
    console.log("Server is running on port 4250");
});
