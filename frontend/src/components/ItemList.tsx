import type { Item } from "../services/api";

interface ItemListProps {
  items: Item[];
  loading: boolean;
}

function ItemList({
  items,
  loading,
}: ItemListProps) {
  if (loading) {
    return <p>Loading saved items...</p>;
  }

  if (items.length === 0) {
    return <p>No saved content yet.</p>;
  }

  return (
    <section>
      <h2>Saved Items</h2>

      {items.map((item) => (
        <article key={item.id}>
          <div>
            <strong>{item.title}</strong>

            <span>
              {item.sourceType}
            </span>
          </div>

          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open source
            </a>
          )}

          <small>
            {new Date(
              item.createdAt
            ).toLocaleString()}
          </small>
        </article>
      ))}
    </section>
  );
}

export default ItemList;