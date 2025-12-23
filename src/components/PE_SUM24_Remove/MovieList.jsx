import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

function MovieList() {
    const [directors, setDirectors] = useState([]);
    const [producers, setProducers] = useState([]);
    const [movies, setMovies] = useState([]);
    const [stars, setStars] = useState([]);

    const [selectedDirector, setSelectedDirector] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

    const [filterMovie, setFilterMovies] = useState([]);

    useEffect(() => {
        axios.get('/producers')
            .then((response) => setProducers(response.data))
            .catch((err) => console.log(err));

        axios.get('/directors')
            .then((response) => setDirectors(response.data))
            .catch((err) => console.log(err));

        axios.get('/stars')
            .then((response) => setStars(response.data))
            .catch((err) => console.log(err));

        axios.get('/movies')
            .then((response) => setMovies(response.data))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        const filterMoviess = movies?.filter((move) => {
            let matchesDirector = true;
            let matchesGenre = true;

            if (selectedDirector) {
                matchesDirector = String(move?.director) === String(selectedDirector);
            }
            if (selectedGenre) {
                matchesGenre = move?.genres?.includes(selectedGenre);
            }
            return matchesDirector && matchesGenre
        })
        setFilterMovies(filterMoviess);
    }, [movies, selectedDirector, selectedGenre]);

    const renderProducers = () => {
        return producers?.map((pro) => (
            <ul key={pro?.id}>
                <li>
                    <Link onClick={() => setSelectedDirector(pro?.id)} to={`/movie/?director-id=${pro?.id}`}>{pro?.name}</Link>
                </li>
            </ul>
        ));
    };

    const renderGenres = () => {
        return [...new Set(movies?.flatMap((movie) => movie?.genres))].map((genre) => (
            <Link onClick={() => setSelectedGenre(genre)} style={{ marginLeft: '10px', fontSize: "1.5rem" }} to={`/movie/?genre=${genre}`} key={genre}>{genre}</Link>
        ));
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    };

    const renderMovies = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Release</th>
                        <th>Description</th>
                        <th>Producer</th>
                        <th>Director</th>
                        <th>Genres</th>
                        <th>Stars</th>
                    </tr>
                </thead>
                <tbody>
                    {filterMovie?.map((movi) => (
                        <tr key={movi?.id}>
                            <td>{movi?.id}</td>
                            <td>{movi?.title}</td>
                            <td
                                style={{
                                    width: '150px',
                                    padding: '10px',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {formatDate(movi?.release)}
                            </td>
                            <td>{movi?.description}</td>
                            <td
                                style={{
                                    width: '150px',
                                    padding: '10px',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {producers?.find((pro) => String(pro?.id) === String(movi?.producer))?.name}
                            </td>
                            <td
                                style={{
                                    width: '150px',
                                    padding: '10px',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {directors?.find((dir) => String(dir?.id) === String(movi?.director))?.fullname}
                            </td>
                            <td>
                                {movi?.genres?.map((genre) => (
                                    <span key={genre?.id}>
                                        {genre}
                                        <br />
                                    </span>
                                ))}
                            </td>

                            <td
                                style={{
                                    width: '200px',
                                    padding: '10px',
                                    wordWrap: 'break-word',
                                }}
                            >
                                {movi?.stars?.map((starId, index) => {
                                    const star = stars?.find((sta) => sta?.id.toString() === starId.toString());
                                    return (
                                        <div key={index}>
                                            {index + 1} - {star?.fullname || 'Unknown'}
                                        </div>
                                    );
                                })}
                                <br />
                                <Link
                                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                                >
                                    Remove Star
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    }
    return (
        <>
            <Container fluid style={{ width: "90%" }}>
                <Row>
                    <h1 style={{ textAlign: "center" }}>React Application</h1>
                </Row>
                <hr style={{ color: "green", border: "2px solid " }} />
                <Row>
                    <div style={{ textAlign: 'center' }}>{renderGenres()}</div>
                </Row>
                <hr style={{ color: "green", border: "2px solid " }} />
                <Row>

                    <Col md={3}>
                        <h2>Directors</h2>
                        {renderProducers()}
                    </Col>

                    <Col md={9}>
                        <h2 className='text-center'>List of Movie</h2>
                        <Row>
                            <Link onClick={() => { }} to="#">
                                Show all movies
                            </Link>
                        </Row>
                        {renderMovies()}
                    </Col>

                </Row>
            </Container>

        </>
    )
}

export default MovieList
