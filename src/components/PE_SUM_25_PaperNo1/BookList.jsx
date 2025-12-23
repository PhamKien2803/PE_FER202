import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import axios from "axios";

function BookList() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [author, setAuthor] = useState("");
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);

    const sortBooksByRating = (books) => {
        return books.slice().sort((a, b) => b.rating - a.rating);
    };

    const extractCategories = (books) => {
        return [...new Set(books.map((b) => b.category))];
    };

    const extractAuthors = (books) => {
        return [...new Set(books.map((b) => b.author))];
    };

    useEffect(() => {
        axios.get("/books")
            .then((res) => {
                const data = res.data;
                const sorted = sortBooksByRating(data);
                setBooks(prevBooks => {
                    const prevStr = JSON.stringify(prevBooks);
                    const newStr = JSON.stringify(sorted);
                    if (prevStr !== newStr) {
                        return sorted;
                    }
                    return prevBooks;
                });
                setFilteredBooks(sorted);
                setCategories(extractCategories(sorted));
                setAuthors(extractAuthors(sorted));
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        let result = [...books];
        if (search) {
            result = result.filter((b) =>
                b.title.toLowerCase().startsWith(search.toLowerCase())
            );
        }
        if (category) {
            result = result.filter((b) => b.category === category);
        }
        if (author) {
            result = result.filter((b) => b.author === author);
        }
        setFilteredBooks(result);
    }, [search, category, author, books]);

    return (
        <Container style={{ maxWidth: 1200, marginTop: 30, marginBottom: 30 }}>
            <h3 className="text-center mb-4">Book List</h3>

            {/* Filter & Search Row */}
            <Row className="gx-2 gy-2 align-items-center justify-content-center mb-2">
                <Col xs={12} md={3}>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Select
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    >
                        <option value="">All Authors</option>
                        {authors.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col xs={12} md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Enter title to search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>
            </Row>

            {/* Borrow Button Row */}
            <Row className="mt-2 mb-4">
                <Col className="text-end">
                    <a href="/borrow/create">
                        <Button variant="success">Borrow</Button>
                    </a>
                </Col>
            </Row>

            {/* Book List Section */}
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {filteredBooks.length === 0 ? (
                    <Col>
                        <div className="text-center text-muted">No books found.</div>
                    </Col>
                ) : (
                    filteredBooks.map((book) => (
                        <Col key={book.id}>
                            <Card className="h-100 shadow-sm">
                                <Card.Img
                                    variant="top"
                                    src={book.image}
                                    alt={book.title}
                                    style={{ height: 180, objectFit: "cover" }}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="text-center fw-bold" style={{ fontSize: 16 }}>
                                        {book.title}
                                    </Card.Title>
                                    <Card.Text className="mb-1" style={{ fontSize: 14 }}>
                                        <strong>Author:</strong> {book.author}
                                    </Card.Text>
                                    <Card.Text className="mb-1" style={{ fontSize: 14 }}>
                                        <strong>Category:</strong> {book.category}
                                    </Card.Text>
                                    <Card.Text className="mb-1" style={{ fontSize: 14 }}>
                                        <strong>Rating:</strong> {book.rating}
                                    </Card.Text>
                                    <Card.Text className="mb-1" style={{ fontSize: 14 }}>
                                        <strong>Available Copies:</strong> {book.availableCopies}
                                    </Card.Text>
                                    <Card.Text className="mb-1" style={{ fontSize: 14 }}>
                                        <strong>Total Copies:</strong> {book.totalCopies}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
}

export default BookList;
