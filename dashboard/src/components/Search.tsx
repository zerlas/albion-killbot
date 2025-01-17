import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Card, Dropdown, Form, InputGroup } from "react-bootstrap";
import { useFetchConstantsQuery, useLazySearchQuery } from "store/api";
import { Limits } from "types";
import Loader from "./Loader";
import SearchResults from "./SearchResults";

interface ISearchProps {
  limits: Limits;
}

const Search = ({ limits }: ISearchProps) => {
  const constants = useFetchConstantsQuery();
  const [query, setQuery] = useState("");
  const [server, setServer] = useState<string>("");
  const [search, searchResults] = useLazySearchQuery();

  useEffect(() => {
    if (constants.data?.servers) setServer(constants.data.servers[0]);
  }, [constants.data?.servers]);

  if (constants.isLoading || !constants.data) return <Loader />;
  const { servers } = constants.data;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    if (!server) return;

    e?.preventDefault();
    search({ server, query }, true);
  };

  return (
    <Card>
      <Card.Body className="p-2">
        <Form onSubmit={handleSearch}>
          <Form.Group controlId="search-albion" className="px-2">
            <Form.Label>Search</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                aria-describedby="search-help"
                placeholder="Search in Albion Online for name or ID"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Dropdown>
                <Dropdown.Toggle variant="primary">{server}</Dropdown.Toggle>

                <Dropdown.Menu>
                  {servers.map((server) => (
                    <Dropdown.Item
                      key={server}
                      onClick={() => setServer(server)}
                    >
                      {server}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </InputGroup>
            <Form.Text id="search-help" muted>
              For alliances, only search by <b>ID</b> is working
            </Form.Text>
          </Form.Group>
        </Form>
      </Card.Body>

      {!searchResults.isUninitialized && (
        <Card.Footer>
          {searchResults.isFetching ? (
            <Loader width={500} height={250}>
              <rect x="5" y="10" rx="5" ry="5" width="490" height="70" />
              <rect x="5" y="90" rx="5" ry="5" width="490" height="70" />
              <rect x="5" y="170" rx="5" ry="5" width="490" height="70" />
            </Loader>
          ) : (
            <SearchResults limits={limits} searchResults={searchResults.data} />
          )}
        </Card.Footer>
      )}
    </Card>
  );
};

export default Search;
