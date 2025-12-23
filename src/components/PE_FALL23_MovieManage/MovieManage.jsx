import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MovieManage() {
  const [producers, setProducers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [movieStars, setMovieStars] = useState([]);
  const [stars, setStars] = useState([]);

  const [searchValue, setSearchValue] = useState('');
  const [selectProducers, setSelectProducers] = useState([]);
  const [filterMovies, setFilterMovies] = useState([]);


  useEffect(() => {
    axios.get('/producers')
      .then((response) => setProducers(response.data))
      .catch((err) => console.log(err));

    axios.get('/directors')
      .then((response) => setDirectors(response.data))
      .catch((err) => console.log(err));

    axios.get('/movie_star')
      .then((response) => setMovieStars(response.data))
      .catch((err) => console.log(err));

    axios.get('/stars')
      .then((response) => setStars(response.data))
      .catch((err) => console.log(err));

    axios.get('/movies')
      .then((response) => setMovies(response.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const filterMovie = movies?.filter((mov) => {
      let matchesSearch = true;
      let matchesProducer = true;

      if (searchValue) {
        matchesSearch = mov?.Title?.toLowerCase().includes(searchValue.toLowerCase());
      }

      if (selectProducers) {
        matchesProducer = String(mov?.ProducerId) === String(selectProducers);
      }

      return matchesSearch && matchesProducer;
    })
    setFilterMovies(filterMovie);
  }, [movies, searchValue, selectProducers]);

  const renderProducers = () => {
    return producers?.map((pro) => (
      <ul key={pro?.id}>
        <li>
          <Link to={`/movie/?producer-id=${pro?.id}`} onClick={() => setSelectProducers(pro?.id)}>{pro?.Name}</Link>
        </li>
      </ul>
    ))
  }

  const renderMovies = () => {
    return (
      <Table striped hover bordered>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>ReleaseDate</th>
            <th>Description</th>
            <th>Language</th>
            <th>Director</th>
            <th>Stars</th>
          </tr>
        </thead>
        <tbody>
          {filterMovies?.map((mov) => (
            <tr key={mov?.id}>
              <td>{mov?.id}</td>
              <td>{mov?.Title}</td>
              <td>{mov?.ReleaseDate}</td>
              <td>{mov?.Description}</td>
              <td>{mov?.Language}</td>
              <td style={{ width: "20%" }}>
                {
                  directors?.find((dir) => String(dir?.id) === String(mov?.DirectorId))?.FullName
                }
              </td>
              <td>{mov?.id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }
  return (
    <>
      <Container fluid style={{ width: "90%" }}>
        <h2 className='text-center'>Movies Management</h2>
        <Row className="justify-content-center mt-3 mb-4">
          <input
            style={{ width: "45%" }}
            type="text"
            placeholder="Enter movie title to search ..."
            className="form-control"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Row>
        <Row>
          <Col md={3}>
            <h3>Producers</h3>
            {renderProducers()}
          </Col>
          <Col md={9}>
            {renderMovies()}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MovieManage;
