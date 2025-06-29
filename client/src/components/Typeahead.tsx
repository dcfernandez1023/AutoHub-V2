import { useEffect, useRef, useState } from 'react';
import { Form, Dropdown, Spinner } from 'react-bootstrap';

interface TypeaheadProps<T> {
  debounce: number;
  onSearch: (searchText: string) => Promise<T[]>;
  onSelect: (item: T) => void;
  getLabel: (item: T) => string;
}

export default function Typeahead<T>(props: TypeaheadProps<T>) {
  const [searchText, setSearchText] = useState<string>('');
  const [items, setItems] = useState<T[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const debounceTimeout = useRef<NodeJS.Timeout>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchToken = useRef(0);

  const { debounce, onSearch, onSelect, getLabel } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setShowDropdown(true);

    const value = e.target.value;
    setSearchText(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        if (value.trim().length === 0) {
          setItems([]);
          setShowDropdown(false);
          return;
        }

        const currentToken = ++searchToken.current;

        const results: T[] = await onSearch(value);
        if (currentToken !== searchToken.current) {
          return; // Stale search, ignore
        }
        setItems(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, debounce);
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    setSearchText(getLabel(item));
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        searchToken.current++;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Form.Control
        type="text"
        value={searchText}
        onChange={handleChange}
        onFocus={() => setShowDropdown(items.length > 0)}
        autoComplete="off"
      />
      <Dropdown.Menu
        show={showDropdown}
        style={{
          position: 'absolute',
          width: '100%',
          zIndex: 1000,
        }}
      >
        {loading ? (
          <div className="typeahead-spinner-margin">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <>
            {items.map((item, index) => (
              <Dropdown.Item key={index} onClick={() => handleSelect(item)}>
                {getLabel(item)}
              </Dropdown.Item>
            ))}
          </>
        )}
      </Dropdown.Menu>
    </div>
  );
}
