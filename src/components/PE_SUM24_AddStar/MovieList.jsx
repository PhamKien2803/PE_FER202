import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function MovieList() {
  const [directors, setDirectors] = useState([]);
  const [producers, setProducers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [stars, setStars] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const [filteredMovies, setFilteredMovies] = useState([]);

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

  useEffect(() => { //nếu dùng useEffect thì phải có State của cái cần làm vidu 
    // như filteredMovies để thay đổi trạng thái của dữ liệu thông qua cái state đó
    const filteredMovies = movies.filter((movie) => {
      let matchesProducer = true;
      let matchesGenre = true;

      if (selectedProducer) {
        matchesProducer = movie.producer.toString() === selectedProducer.toString();
      }

      if (selectedGenre) {
        matchesGenre = movie.genres.includes(selectedGenre);
      }

      return matchesProducer && matchesGenre;
    });

    setFilteredMovies(filteredMovies); // Cập nhật state mới
  }, [movies, selectedProducer, selectedGenre]);


  const renderGenres = () => {
    return [...new Set(movies?.flatMap((movie) => movie?.genres))].map((genre) => (
      <Link style={{ fontSize: '20px', marginLeft: '10px' }} to={`/movie/?genre=${genre}`} onClick={() => setSelectedGenre(genre)}>{genre}</Link>
    ));
  };

  const renderProducers = () => {
    return producers?.map((pro) => (
      <ul key={pro?.id}>
        <li>
          <Link to={`/movie/?producer-id=${pro?.id}`} onClick={() => setSelectedProducer(pro?.id)}>{pro?.name}</Link>
        </li>
      </ul>
    ));
  };

  const renderMovies = () => { //còn không dùng useEffect thì không cần State mới
    // const filteredMoviess = movies.filter((movie) => {
    //   let matchesProducer = true;
    //   let matchesGenre = true;

    //   if (selectedProducer) {
    //     matchesProducer = movie?.producer.toString() === selectedProducer.toString();
    //   }

    //   if (selectedGenre) {
    //     matchesGenre = movie?.genres.includes(selectedGenre);
    //   }

    //   return matchesProducer && matchesGenre;
    // });
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
          {filteredMovies?.map((movi) => (
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
                {movi?.genres?.map((genre, index) => (
                  <span key={index}>
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
                  to={`/movie/${movi?.id}/add-stars`}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  Add Star
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const showAllMovies = () => {
    setSelectedGenre(null);
    setSelectedProducer(null);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  return (
    <Container fluid style={{ width: '90%' }}>
      <Row>
        <h1 style={{ textAlign: 'center' }}>React Application</h1>
        <hr style={{ color: 'green', border: '2px solid' }} />
        <div style={{ textAlign: 'center' }}>{renderGenres()}</div>
        <hr style={{ color: 'green', border: '2px solid' }} />
      </Row>

      <Row>
        <Col md={2}>
          <h3>Producers</h3>
          {renderProducers()}
        </Col>
        <Col md={10}>
          <h3 style={{ textAlign: 'center' }}>List of Movies</h3>
          <Link onClick={showAllMovies} to="#">
            Show all movies
          </Link>
          {renderMovies()}
        </Col>
      </Row>
    </Container>
  );
}

export default MovieList;
