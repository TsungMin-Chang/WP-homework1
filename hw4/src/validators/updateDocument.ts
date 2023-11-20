import { z } from "zod";

export const updateDocSchema = z.object({
  documentDisplayId: z.string(),
  authorDisplayId: z.string(),
  content: z.string(),
});
