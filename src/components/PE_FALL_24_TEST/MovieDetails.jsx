import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    axios.get('/movies')
      .then(res => {
        const foundMovie = res.data.find(m => m.id === parseInt(id));
        setMovie(foundMovie);
      })
      .catch(err => console.error(err));

    axios.get('/directors')
      .then(res => setDirectors(res.data))
      .catch(err => console.error(err));

    axios.get('/genres')
      .then(res => setGenres(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const getDirectorName = (id) => {
    const director = directors.find(d => d.id === id);
    return director ? director.name : '';
  };

  const getGenreName = (id) => {
    const genre = genres.find(g => g.id === id);
    return genre ? genre.name : '';
  };

  const handleDelete = async () => {
    if (!movie) return;

    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await axios.delete(`/movies/${movie.id}`);
        alert("Movie deleted successfully");
        window.location.href = "/";
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!movie) return <p className="text-center mt-5">Loading movie details...</p>;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col xs="auto">
          <Image
            src={`/${movie.poster}`}
            alt={movie.title}
            rounded
            style={{ width: '250px', height: '250px', objectFit: 'cover' }}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <h3>{movie.title}</h3>
          <p><strong>Director:</strong> {getDirectorName(movie.director)}</p>
          <p><strong>Genre:</strong> {getGenreName(movie.genre)}</p>
          <p><strong>Release Year:</strong> {movie.release_year}</p>
          <p><strong>Duration:</strong> {movie.duration} minutes</p>

          <div className="d-flex gap-2 mt-3">
            <Button as={Link} to="/" variant="secondary">Back to List</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default MovieDetails;
