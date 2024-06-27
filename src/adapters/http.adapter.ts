import express, { Router } from "express";
import { TokenService } from "../core/services/token.service";
import { redisClient } from "./redis.adapter";
import { dataSchema } from "../core/models/token.model";

const api = Router()
api.use(express.json());

const tokenService = new TokenService(redisClient);

api.get("/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const data = await tokenService.getUserToken(userId);
        if (!data) return res.status(404).json({ error: "User not found" });
        res.json(data);
    } catch (error) {
        res.status(400).json({ error });
    }
});

api.post("/", async (req, res) => {
    const parseResult = dataSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors });
    }

    try {
        await tokenService.updateUserToken(parseResult.data);
        res.json({ result: "Success" });
    } catch (error) {
        res.status(500).json({ error });
    }
});

api.delete("/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        await tokenService.deleteUserToken(userId);
        res.json({ result: "User deleted" });
    } catch (error) {
        res.status(404).json({ error });
    }
});

export { api as tokenApi };
