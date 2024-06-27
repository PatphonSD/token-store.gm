import { dataSchema, TokenData } from "../models/token.model";

export class TokenService {
    constructor(private redisClient: any) {}

    async getUserToken(userId: string): Promise<TokenData | null> {
        const result = await this.redisClient.get(`user_${userId}`);
        if (!result) return null;
        
        const parseResult = dataSchema.safeParse(JSON.parse(result));
        if (!parseResult.success) throw new Error("Invalid data format");

        return parseResult.data;
    }

    async updateUserToken(data: TokenData): Promise<void> {
        const previousData = await this.redisClient.get(`user_${data.user_id}`);
        let updatedData = { ...data };

        if (previousData) {
            const parsePreviousData = dataSchema.safeParse(JSON.parse(previousData));
            if (!parsePreviousData.success) throw new Error("Invalid previous data format");

            updatedData = {
                ...data,
                input_token: parsePreviousData.data.input_token + data.input_token,
                output_token: parsePreviousData.data.output_token + data.output_token,
            };
        }

        await this.redisClient.set(`user_${data.user_id}`, JSON.stringify(updatedData));
    }

    async deleteUserToken(userId: string): Promise<void> {
        const isUserExisted = await this.redisClient.get(`user_${userId}`);
        if (!isUserExisted) throw new Error("User not found");

        await this.redisClient.del(`user_${userId}`);
    }
}
