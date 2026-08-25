import { ingestSchema } from "../validation/ingest.schema.js";
import { ingestNote , ingestUrl} from "../services/ingestion.service.js";

export async function ingest(req, res, next) {
  try {
    const data = ingestSchema.parse(req.body);

      let item;

    if (data.type === "note") {
      item = await ingestNote(data);
    } else {
      item = await ingestUrl(data);
    }

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}