import { findAllItems } from "../repositories/item.repository.js";

export function getItems(req, res, next) {
  try {
    const items = findAllItems();

    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
}