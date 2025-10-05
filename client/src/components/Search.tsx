import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

type SearchProps = {
  placeholder: string;
  onSearch: (searchText: string) => void;
  debounce?: number;
};

const Search: React.FC<SearchProps> = (props: SearchProps) => {
  const { placeholder, onSearch, debounce } = props;

  const [searchText, setSearchText] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  return (
    <>
      <InputGroup>
        <InputGroup.Text>🔎︎</InputGroup.Text>
        <Form.Control
          type="text"
          value={searchText}
          autoComplete="off"
          onChange={handleChange}
          placeholder={placeholder}
        />
      </InputGroup>
    </>
  );
};

export default Search;
