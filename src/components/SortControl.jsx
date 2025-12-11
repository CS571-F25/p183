import { Form } from 'react-bootstrap';

/**
 * SortControl - Accessible dropdown for sorting Now page items
 * Allows sorting by date (newest first or oldest first)
 */
export default function SortControl({ sortOrder, onSortChange }) {
  return (
    <div className="sort-control">
      <Form.Label htmlFor="sort-order" className="me-2 mb-0">
        Sort by:
      </Form.Label>
      <Form.Select
        id="sort-order"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort activities by date"
        style={{ width: 'auto', display: 'inline-block' }}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </Form.Select>
    </div>
  );
}

