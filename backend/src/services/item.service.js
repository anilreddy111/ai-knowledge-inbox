import {findAllItems} from "../repositories/item.repository.js";

export function getAllItems() {
  return findAllItems();
}