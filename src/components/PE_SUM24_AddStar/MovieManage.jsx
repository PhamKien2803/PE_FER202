import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function MovieManage() {
    //State Call API
    const [directors, setDirectors] = useState([]);
    const [producers, setProducers] = useState([]);
    const [movies, setMovies] = useState([]);
    const [stars, setStars] = useState([]);
    const [yourMovies, setYourMovies] = useState([]);

    //State quản lý trạng thái dữ liệu
    const [selectMovie, setSelectMovie] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectProducers, setSelectProducers] = useState([]);
    const [selectStars, setSelectStars] = useState([]);
    const [radioValue, setRadioValue] = useState("all");
    const [sort, setSort] = useState("");
    const [filterMovie, setFilterMovie] = useState([]);

    //State quản lý dữ liệu tạm thời
    const [yourMovieTemp, setYourMovieTemp] = useState([]);

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

        axios.get('/your_movie')
            .then((response) => setYourMovies(response.data))
            .catch((err) => console.log(err));

    }, []);

    useEffect(() => {
        const filterMoviess = movies?.filter((mov) => {
            let matchesGenre = true;
            let matchesSearch = true;
            let matchesCheckBox = true;
            let matchesRadio = true;

            //Search by title
            if (searchValue) {
                matchesSearch = mov?.title.toLowerCase().includes(searchValue.toLowerCase());
            }

            //Filter by genre Link
            if (selectedGenre && selectedGenre !== 0) {
                matchesGenre = String(mov?.genres).includes(String(selectedGenre));
            }

            // Filter by producers CheckBox
            if (selectProducers.length) {
                matchesCheckBox = selectProducers.includes(mov?.producer);
            }

            // Filter by stars CheckBox
            if (selectStars.length) {
                matchesCheckBox = mov?.stars.some((starId) => selectStars.includes(String(starId)));
            }


            // Filter by stars Radio
            if (radioValue === "all") {
                matchesRadio = true;
            } else {
                // Kiểm tra nếu bất kỳ star nào trong `mov.stars` khớp với radioValue
                //nguyên nhân ở đây là do mov.stars là mảng chứa id của các star trong movies, mà stars lại là 1 mảng
                matchesRadio = mov?.stars.some((starId) => String(starId) === String(radioValue));
            }

            return matchesGenre && matchesSearch && matchesCheckBox && matchesRadio;
        })

        //Sort by Title
        const sortTitleMovie = [...filterMoviess].sort((a, b) => {
            if (sort === "asc") {
                return a.title.localeCompare(b.title);
            } else if (sort === "desc") {
                return b.title.localeCompare(a.title);
            }
            return 0;
        })

        setFilterMovie(sortTitleMovie);
    }, [movies, searchValue, selectedGenre, selectProducers, radioValue, selectStars, sort]);

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }
    const renderGenres = () => {
        return [...new Set(movies?.flatMap((movi) => movi?.genres))]?.map((genres) => (
            <Link style={{ fontSize: '20px' }} to={`/movie-manage/?genre=${genres}`} onClick={() => setSelectedGenre(genres)}>{genres}</Link>
        ))
    }

    const handleViewMovie = (id) => {
        const movie = movies?.find((mov) => mov?.id === id);
        setSelectMovie(movie);
    }

    const handleShowAllMovie = (e) => {
        e.preventDefault();
        setSelectMovie(null);
        window.location.href = '/movie-manage';
    }

    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSelectMovie((prevMovie) => ({
            ...prevMovie,
            [name]: value
        }))
    }

    const handleUpdateMovie = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            if (!selectMovie?.description) {
                alert('Description is required !!!');
                return;
            }
            const request = await axios.put(`/movies/${selectMovie?.id}`, selectMovie);
            if (request.status === 200) {
                alert('Update movie successfully !!!');
                setSelectMovie(null);
                window.location.href = '/movie-manage';
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleAddYourMovie = (movie) => {
        const filterdMovie = {
            id: movie?.id,
            title: movie?.title,
            release: movie?.release,
            genres: movie?.genres,
            stars: movie?.stars
        };

        setYourMovieTemp([...yourMovieTemp, filterdMovie]);
    }

    const removeYourMovie = (id) => {
        const filteredMovie = yourMovieTemp?.filter((mov) => mov?.id !== id);
        setYourMovieTemp(filteredMovie);
    }

    const handleSaveYourMovies = async () => {
        try {
            const request = await axios.post(`/your_movie`, {
                id: String(Math.floor(Math.random() * 1000)),
                movies: yourMovieTemp
            })
            if (request.status === 201) {
                alert('Save your movies successfully !!!');
                setYourMovieTemp([]);
                window.location.href = '/movie-manage';
            }
        } catch (error) {
            console.error("Error saving movies:", error)
        }
    }

    //Xóa 1 bộ phim cụ thể trong danh sách phim 
    // const handleDeleteYourMovie1 = async (yourMovieId, movieId) => {
    //     try {
    //         const request = await axios.delete(`/your_movie/${yourMovieId}/movie/${movieId}`);
    //         if (request.status === 200) {
    //             alert('Delete your movie successfully !!!');
    //             window.location.href = '/movie-manage';
    //         }
    //     } catch (error) {
    //         console.error("Error deleting movie:", error)
    //     }
    // }

    //Xóa toàn bộ bộ phim 
    const handleDeleteYourMovie2 = async (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this movie?')) {
                const request = await axios.delete(`/your_movie/${id}`);
                if (request.status === 200) {
                    alert('Delete your movie successfully !!!');
                    window.location.href = '/movie-manage';
                }
            }else{
                return;
            }

        } catch (error) {
            console.error("Error deleting movie:", error)
        }
    }

    const renderMovieList = () => {
        return (
            <Table striped hover bordered>
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
                    {filterMovie?.map((mov) => (
                        <tr key={mov?.id}>
                            <td>{mov?.id}</td>
                            <td>{mov?.title}</td>
                            <td>{formatDate(mov?.release)}</td>
                            <td>{mov?.description}</td>
                            <td>
                                {
                                    producers?.find((pro) => String(pro?.id) === String(mov?.producer))?.name
                                }
                            </td>
                            <td>
                                {
                                    directors?.find((dir) => String(dir?.id) === String(mov?.director))?.fullname
                                }
                            </td>
                            <td>
                                {
                                    mov?.genres?.map((genre) => (
                                        <span key={genre?.id}>
                                            {genre}
                                            <br />
                                        </span>
                                    ))
                                }
                            </td>
                            <td style={{
                                width: '200px',
                                padding: '10px',
                                wordWrap: 'break-word',
                            }}>
                                {mov?.stars?.map((starId, index) => {
                                    const star = stars?.find((sta) => String(sta?.id) === String(starId));
                                    return (
                                        <div key={index}>
                                            {index + 1} - {star?.fullname || 'Unknown'}
                                        </div>
                                    );
                                })}
                                <br />
                                <Link onClick={() => handleViewMovie(mov?.id)} style={{ display: "flex", justifyContent: "flex-end" }}>View to Update</Link>
                                <Link onClick={() => handleAddYourMovie(mov)} style={{ display: "flex", justifyContent: "flex-end" }}>Add your Movies</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    const renderYourMoviesTemp = () => {
        return (
            <Table striped hover bordered>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Release</th>
                        <th>Genres</th>
                        <th>Stars</th>
                        <th>Function</th>
                    </tr>
                </thead>
                <tbody>
                    {yourMovieTemp?.map((mov) => (
                        <tr key={mov?.id}>
                            <td>{mov?.id}</td>
                            <td>{mov?.title}</td>
                            <td>{formatDate(mov?.release)}</td>
                            <td>{
                                mov?.genres?.map((genre) => (
                                    <span key={genre?.id}>
                                        {genre}
                                        <br />
                                    </span>
                                ))
                            }</td>
                            <td>
                                {mov?.stars?.map((starId, index) => {
                                    const star = stars?.find((sta) => String(sta?.id) === String(starId));
                                    return (
                                        <div key={index}>
                                            {index + 1} - {star?.fullname || 'Unknown'}
                                        </div>
                                    );
                                })}
                            </td>
                            <td>
                                <Button onClick={() => removeYourMovie(mov?.id)} variant='danger'>Remove</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    const renderYourMovies = () => {
        //vì nó là mảng trong mảng , mà mảng đó lại chứa object nên phải truy cập vào phần tử đầu tiên
        // const movies = yourMovies[0]?.movies || []; // Truy cập `movies` từ phần tử đầu tiên

        return (
            <Table striped hover bordered>
                <thead>
                    <tr>
                        <th>YourMovie Id</th>
                        <th>Title</th>
                        <th>Release</th>
                        <th>Genres</th>
                        <th>Stars</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {yourMovies.map((yourMovie) => (
                        yourMovie.movies.map((movie) => (
                            <tr key={`${yourMovie?.id}-${movie?.id}`}>
                                <td>{yourMovie?.id}</td>
                                <td>{movie?.title}</td>
                                <td>{formatDate(movie.release)}</td>
                                <td>{
                                    movie?.genres?.map((genre) => (
                                        <span key={genre?.id}>
                                            {genre}
                                            <br />
                                        </span>
                                    ))
                                }</td>
                                <td>
                                    {movie?.stars?.map((starId, index) => {
                                        const star = stars?.find((sta) => String(sta?.id) === String(starId));
                                        return (
                                            <div key={index}>
                                                {index + 1} - {star?.fullname || 'Unknown'}
                                            </div>
                                        );
                                    })}
                                </td>
                                <td>
                                    <Button onClick={() => handleDeleteYourMovie2(yourMovie?.id)} variant='danger'>Delete</Button>
                                </td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </Table>
        );
    }

    const handleSelectProducers = (producer) => {
        const pros = parseInt(producer);
        setSelectProducers((prevProducer) => {
            return prevProducer?.includes(pros)
                ? prevProducer?.filter((pro) => pro !== pros)
                : [...prevProducer, pros];
        })
    }

    const renderProducersCheckBox = () => {
        return producers?.map((pro) => (
            <Form.Check
                key={pro?.id}
                type='checkbox'
                label={pro?.name}
                onChange={() => handleSelectProducers(pro?.id)}
            >
            </Form.Check>
        ))
    }

    const renderStarsRadio = () => {
        return (
            <>
                <Form.Group>
                    <Form.Check
                        key={0}
                        label="All"
                        type="radio"
                        value="all"
                        onChange={(e) => setRadioValue(e.target.value)}
                        checked={radioValue === "all"}
                    >
                    </Form.Check>
                    {stars?.map((sta) => (
                        <Form.Check
                            key={sta?.id}
                            label={sta?.fullname}
                            type="radio"
                            value={sta?.id}
                            onChange={(e) => setRadioValue(e.target.value)}
                            checked={radioValue === sta?.id}
                        >
                        </Form.Check>
                    ))}
                </Form.Group>
            </>
        )
    }

    const handleSelectStars = (star) => {
        setSelectStars((prevStar) => {
            return prevStar?.includes(star)
                ? prevStar?.filter((sta) => sta !== star)
                : [...prevStar, star];
        })
    }

    const renderStarsCheckBox = () => {
        return stars?.map((sta) => (
            <Form.Check
                key={sta?.id}
                type='checkbox'
                label={sta?.fullname}
                onChange={() => handleSelectStars(sta?.id)}
            >
            </Form.Check>
        ))
    }
    //Sort By Title
    const renderSortTitleMovie = () => {
        return (
            <Form.Select value={sort} style={{ width: "40%" }} onChange={(e) => setSort(e.target.value)}>
                <option value="">--- Select Sort ---</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </Form.Select>
        )
    }
    return (
        <>
            <Container>
                <Row>
                    <h1 className='text-center mb-3'>Movie Management</h1>
                    <hr style={{ color: 'green', border: '2px solid' }} />
                    <div style={{ justifyContent: "center", gap: "1rem", display: "flex", marginBottom: "1rem" }}>{renderGenres()}</div>
                    <hr style={{ color: 'green', border: '2px solid' }} />
                </Row>
                <Row>
                    <input onChange={(e) => setSearchValue(e.target.value)} className='form-control mb-3' type='text' placeholder='Enter title to search ...' />
                </Row>
                <Row>
                    <Col md={8}>
                        <h3 className='text-center'>Movie List</h3>
                        <Row>

                            <Col md={6}>
                                <Link onClick={handleShowAllMovie} to="#">
                                    Show all movies
                                </Link>
                            </Col>


                            <Col md={6}>
                                <span style={{ display: "flex", justifyContent: "flex-end" }}>Sort by Title:&nbsp;
                                    {renderSortTitleMovie()}
                                </span>
                            </Col>

                        </Row>

                        {renderMovieList()}
                    </Col>
                    <Col md={4}>
                        <h3 className='text-center'>Movies Updates</h3>
                        {selectMovie ? (
                            <div>
                                <h4>Title: {selectMovie?.title}</h4>
                                <h4>Release: {formatDate(selectMovie?.release)}</h4>
                                <h4>Producers: {producers?.find((pro) => String(pro?.id) === String(selectMovie?.producer))?.name}</h4>
                                <h3>Update Description: </h3>
                                <textarea onChange={handleChangeValue} name="description" value={selectMovie?.description} /> <br />
                                <Button size='lg' style={{ marginTop: "2rem" }} variant='warning' onClick={handleUpdateMovie}>Update</Button>
                            </div>
                        ) : (
                            <p className='text-center'>Movie is Empty !!!</p>
                        )}
                        <hr style={{ border: "2px dotted black" }} />
                        <h3 className='text-center'>Your Movies</h3>
                        {yourMovieTemp.length > 0 ? (
                            <div>
                                {renderYourMoviesTemp()}
                                <Button style={{ marginTop: "2rem" }} variant='success' onClick={handleSaveYourMovies}>
                                    Save
                                </Button>
                            </div>
                        ) : (
                            <p style={{ textAlign: "center" }}>(Your Movies is Empty !!!)</p>
                        )}
                        <hr style={{ border: "2px dotted black" }} />
                        <h3 className='text-center'>Movie Details</h3>
                        {yourMovies.length > 0 ? (
                            <>
                                {renderYourMovies()}
                            </>
                        ) : (
                            <p style={{ textAlign: "center" }}>(Movie Details is Empty !!!)</p>
                        )}
                        <hr style={{ border: "2px dotted black" }} />
                        <h4>Filter by Producers CheckBox:</h4>
                        {renderProducersCheckBox()}
                        <hr style={{ border: "2px dotted black" }} />
                        <h4>Filter by Stars Radio:</h4>
                        {renderStarsRadio()}
                        <hr style={{ border: "2px dotted black" }} />
                        <h4>Filter by Stars CheckBox:</h4>
                        {renderStarsCheckBox()}
                    </Col>
                </Row>
            </Container>

        </>
    )
}

export default MovieManage
