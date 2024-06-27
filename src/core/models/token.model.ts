import { z } from "zod";

export const dataSchema = z.object({
    user_id: z.string(),
    input_token: z.number(),
    output_token: z.number(),
});

export type TokenData = z.infer<typeof dataSchema>;
