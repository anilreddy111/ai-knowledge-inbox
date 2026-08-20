import { querySchema } from "../validation/query.schema.js";
import { queryKnowledgeBase } from "../services/query.service.js";

export async function query(req, res, next) {
  try {
    const { question } = querySchema.parse(req.body);

    const result = await queryKnowledgeBase(question);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}