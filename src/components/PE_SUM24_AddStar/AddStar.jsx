import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Col, Container, Row } from 'react-bootstrap'

function AddStar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stars, setStars] = useState([])
  const [movies, setMovies] = useState([])
  const [selectedStars, setSelectedStars] = useState([]);


  useEffect(() => {
    axios.get("/stars")
      .then((response) => setStars(response.data))
      .catch((err) => console.log(err));

    axios.get(`/movies/${id}`)
      .then((response) => setMovies(response.data))
      .catch((err) => console.log(err));

  }, [id]);

  const handleStarChange = (starId) => {
    setSelectedStars((prevSelectedStars) => {
      if (prevSelectedStars.includes(starId)) {
        return prevSelectedStars.filter((id) => id !== starId);
      } else {
        return [...prevSelectedStars, starId];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/movies/${id}`, {
        ...movies,
        stars: selectedStars
      })
      alert('Stars added successfully');
      navigate('/movie');
    } catch (err) {
      console.log(err);
      alert('Error adding stars');
    }
  }
  if(!movies) {
    return <div>Loading...</div>
  }

  const renderStars = () => {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {stars?.map((star) => (
          <div
            key={star?.id}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              checked={selectedStars.includes(star?.id)}
              onChange={() => handleStarChange(star?.id)}
              style={{
                marginRight: "5px",
              }}
            />
            {star?.fullname}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Container>
        <Row>
          <h2 style={{ textAlign: 'center' }}>Add stars to the movies</h2>
        </Row>
        <Row>
          <Col md={12}>
            <h5 style={{ fontWeight: 'bold', marginTop: "2rem" }}>Movie title</h5>
            <input type="text" className="form-control" readOnly value={movies?.title} />
            <Row>
              <h5 style={{ fontWeight: 'bold', marginTop: "1rem" }}>Stars</h5>
              {renderStars()}
              <Button onClick={() => handleSubmit()} style={{ width: "8%", marginTop: "1rem" }} variant='success'>Add Stars</Button>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AddStar
