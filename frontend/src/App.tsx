import { useEffect, useState } from "react";

import AddContent from "./components/AddContent";
import ItemList from "./components/ItemList";
import QueryBox from "./components/QueryBox";
import Answer from "./components/Answer";

import {
  getItems,
  type Item,
  type QueryResponse,
} from "./services/api";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [answer, setAnswer] =
    useState<QueryResponse | null>(null);

  const [loadingItems, setLoadingItems] =
    useState(true);

    const [error, setError] = useState("");

async function loadItems() {
  try {
    setError("");

    const data = await getItems();
    setItems(data);
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Failed to load items"
    );
  } finally {
    setLoadingItems(false);
  }
}


  useEffect(() => {
    loadItems();
  }, []);

  return (
    <main>
      <header>
        <h1>AI Knowledge Inbox</h1>

        <p>
          Save knowledge. Ask questions.
          Get grounded answers.
        </p>
      </header>
{error && (
  <div className="error">
    {error}
  </div>
)}
      <AddContent onSaved={loadItems} />

      <ItemList
        items={items}
        loading={loadingItems}
      />

      <QueryBox onResult={setAnswer} />

      <Answer result={answer} />
    </main>
  );
}

export default App;