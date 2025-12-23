import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Container, Row, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedDirector, setSelectedDirector] = useState(0);
    const [selectedGenre, setSelectedGenre] = useState(0);
    const [filteredMovies, setFilteredMovies] = useState([]);

    useEffect(() => {
        axios.get("/movies")
            .then(res => setMovies(res.data))
            .catch(err => console.log(err));

        axios.get("/directors")
            .then(res => setDirectors(res.data))
            .catch(err => console.log(err));

        axios.get("/genres")
            .then(res => setGenres(res.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const filtered = movies.filter((movie) => {
            const matchesDirector = selectedDirector === 0 || movie.director === selectedDirector;
            const matchesGenre = selectedGenre === 0 || movie.genre === selectedGenre;
            return matchesDirector && matchesGenre;
        });
        setFilteredMovies(filtered);
    }, [movies, selectedDirector, selectedGenre]);

    const getDirectorName = (id) => directors.find(d => d.id === id)?.name || '';
    const getGenreName = (id) => genres.find(g => g.id === id)?.name || '';

    const renderFilters = () => (
        <>
            <h5>Director</h5>
            <Form.Group>
                {directors.map((director) => (
                    <Form.Check
                        key={director.id}
                        type="radio"
                        label={director.name}
                        value={director.id}
                        checked={selectedDirector === director.id}
                        onChange={() => setSelectedDirector(director.id)}
                    />
                ))}
            </Form.Group>

            <hr />

            <h5>Genre</h5>
            <Form.Group>
                {genres.map((genre) => (
                    <Form.Check
                        key={genre.id}
                        type="radio"
                        label={genre.name}
                        value={genre.id}
                        checked={selectedGenre === genre.id}
                        onChange={() => setSelectedGenre(genre.id)}
                    />
                ))}
            </Form.Group>
        </>
    );

    const renderMovies = () => (
        filteredMovies.map((movie) => (
            <Col key={movie.id} sm={6} md={4} lg={3} className="d-flex justify-content-center">
                <Card style={{ width: '100%', maxWidth: '270px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Card.Img
                        variant="top"
                        src={`/${movie?.poster}`}
                        style={{ height: "270px", objectFit: "cover", borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
                    />
                    <Card.Body className="d-flex flex-column justify-content-between" style={{ minHeight: "200px" }}>
                        <Card.Title className="text-center" style={{ fontSize: "1.1rem", fontWeight: "600" }}>{movie.title}</Card.Title>
                        <div style={{ fontSize: "0.9rem", marginTop: "10px" }}>
                            <p className="mb-1"><strong>Director:</strong> {getDirectorName(movie.director)}</p>
                            <p className="mb-3"><strong>Genre:</strong> {getGenreName(movie.genre)}</p>
                        </div>
                        <Button as={Link} to={`/movies/${movie.id}`} variant="primary" style={{ width: "100%" }}>
                            View Details
                        </Button>

                    </Card.Body>
                </Card>
            </Col>
        ))
    );


    return (
        <Container fluid style={{ width: "90%" }}>
            <Row>
                <Col md={3} className="mt-4">
                    {renderFilters()}
                </Col>
                <Col md={9}>
                    <div className="d-flex justify-content-end mt-3">
                        <Button as={Link} to="/movies/create" variant="success">
                            Add Movie
                        </Button>
                    </div>
                    <h2 className="text-center my-4">Movie List</h2>
                    <Row className="g-3">
                        {renderMovies()}
                    </Row>

                </Col>

            </Row>
        </Container>
    );
}

export default MovieList;
