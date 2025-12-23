import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function CreateMovie() {
    const [formData, setFormData] = useState({
        title: '',
        director: '',
        genre: '',
        release_year: '',
        duration: '',
    });

    const [directors, setDirectors] = useState([]);
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/directors')
            .then(res => setDirectors(res.data))
            .catch(err => console.error('Failed to fetch directors:', err));

        axios.get('/genres')
            .then(res => setGenres(res.data))
            .catch(err => console.error('Failed to fetch genres:', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const newValue = ['director', 'genre'].includes(name)
            ? Number(value)
            : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get('/movies');
            const movies = response.data;

            const newId = movies.length > 0 ? Math.max(...movies.map(m => m.id || 0)) + 1 : 1;

            const newMovie = {
                ...formData,
                id: newId,
            };
            await axios.post('/movies', newMovie);
            alert('Movie added successfully!');
            navigate('/');
        } catch (err) {
            console.error('Failed to create movie:', err);
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <Card className="p-4 shadow">
                <h3 className="mb-4 text-center">Add New Movie</h3>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Director</Form.Label>
                        <Form.Select
                            name="director"
                            value={formData.director}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Director --</option>
                            {directors.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Genre</Form.Label>
                        <Form.Select
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Genre --</option>
                            {genres.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Release Year</Form.Label>
                        <Form.Control
                            type="number"
                            name="release_year"
                            value={formData.release_year}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Duration (minutes)</Form.Label>
                        <Form.Control
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <div className="text-center">
                        <Button variant="primary" type="submit">
                            Add Movie
                        </Button>
                        <Button as={Link} to="/" variant="secondary">Back to List</Button>
                    </div>
                </Form>
            </Card>


        </Container>
    );
}

export default CreateMovie;
