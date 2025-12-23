import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProductReview() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [addtoCart, setAddToCart] = useState([]);
    const [selectCategory, setSelectCategory] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [reviewerName, setReviewerName] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewPlaced, setReviewPlaced] = useState(false);

    useEffect(() => {
        axios.get('/products')
            .then((response) => setProducts(response.data))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (selectCategory) {
            const filtered = products.filter((pro) => pro.category === selectCategory);
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [selectCategory, products]);

    const handleAddtoCart = (id) => {
        const product = products.find((pro) => pro?.id === id);
        const existingItem = addtoCart.find((item) => item.id === id);

        if (!existingItem) {
            const newItem = {
                id: product.id,
                name: product.title,
                price: product.price,
                category: product.category,
                quantity: 1,
            };
            setAddToCart([newItem]);
        }
        setReviewPlaced(false);
        setReviewerName('');
        setReviewComment('');
        setReviewRating(5);
    };


    const handleSubmitReview = async (productId) => {
        if (!reviewerName.trim() || !reviewComment.trim()) {
            alert("Reviewer Name and Comment are required.");
            return;
        }

        const reviewData = {
            reviewerName: reviewerName,
            comment: reviewComment,
            date: new Date().toISOString(),
            rating: reviewRating
        };
        try {
            await axios.patch(`/products/${productId}`, {
                review: reviewData
            });
            const updatedProducts = await axios.get('/products');
            setProducts(updatedProducts.data);
            setReviewPlaced(true);
            setReviewerName('');
            setReviewComment('');
            setReviewRating(5);
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Error submitting review.");
        }
    };



    const renderSelectCategory = () => {
        const uniqueCategories = [...new Set(products?.map((pro) => pro?.category))];
        return (
            <select
                className='form-select'
                style={{ width: "50%" }}
                value={selectCategory}
                onChange={(e) => setSelectCategory(e.target.value)}
            >
                <option value="">--- Select all category ---</option>
                {uniqueCategories.map((category, index) => (
                    <option key={index} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        );
    };

    const renderCardProducts = () => {
        return (
            <Row>
                {filteredProducts?.map((pro) => {
                    const averageRate = pro?.reviews?.length
                        ? (
                            pro.reviews.reduce((sum, review) => sum + review.rating, 0) / pro.reviews.length
                        ).toFixed(1)
                        : "No rating";

                    return (
                        <Col key={pro?.id} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{pro?.title}</Card.Title>
                                    <Card.Text style={{ marginLeft: "1rem" }}>
                                        <strong>Price:</strong> {pro?.price} <br />
                                        Category: {pro?.category} <br />
                                        <strong>Average Rate: {averageRate}</strong>{" "}
                                    </Card.Text>
                                    <Button
                                        style={{ display: "flex", justifyContent: "center", marginLeft: "2rem" }}
                                        onClick={() => handleAddtoCart(pro?.id)}
                                        variant="primary"
                                        size="sm"
                                    >
                                        Add New Review
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        );
    };

    const renderCartReviewCard = () => {
        const selectedProduct = addtoCart[0];

        return (
            <Card style={{ border: '2px solid lightgray', minHeight: '420px', padding: '1rem' }}>
                <Card.Title><strong>Review details:</strong></Card.Title>
                <Card.Body>
                    {selectedProduct ? (
                        <>
                            <p>ProductId: {selectedProduct.id}</p>
                            <p>Title: {selectedProduct.name}</p>
                            <p>Category: {selectedProduct.category}</p>
                            <p>Price: ${selectedProduct.price}</p>
                            <hr />

                            {reviewPlaced ? (
                                <div style={{ color: "#00b300", textAlign: "center", marginTop: "2rem" }}>
                                    <h2>Thanks for your review!</h2>
                                </div>
                            ) : (
                                <>
                                    <h6><strong>Add a new Review</strong></h6>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="reviewerName">
                                            <Form.Label>Reviewer Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your name"
                                                value={reviewerName}
                                                onChange={(e) => setReviewerName(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="reviewComment">
                                            <Form.Label>Comment</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="Write your feedback"
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Rating</Form.Label>
                                            <div>
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <Form.Check
                                                        inline
                                                        key={num}
                                                        label={num}
                                                        type="radio"
                                                        name="rating"
                                                        checked={reviewRating === num}
                                                        onChange={() => setReviewRating(num)}
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>

                                        <Button variant="warning" onClick={() => handleSubmitReview(selectedProduct.id)}>
                                            Send Review
                                        </Button>
                                    </Form>
                                </>
                            )}
                        </>
                    ) : (
                        <strong style={{ color: "red" }}>Select a product to Review!</strong>
                    )}
                </Card.Body>
            </Card>
        );
    };


    return (
        <>
            <h1 style={{ textAlign: "center", marginTop: "1rem" }}>Product Review System</h1>
            <Container fluid style={{ width: "95%" }}>
                <Row className="align-items-center mb-3">
                    <Col md={6}>
                        {renderSelectCategory()}
                    </Col>
                    <Col md={6} className="d-flex justify-content-end">
                        <Button onClick={() => navigate('/reviews')} variant="success">Show Review List</Button>
                    </Col>
                </Row>

                <Row>
                    <Col md={8}>
                        {renderCardProducts()}
                    </Col>
                    <Col md={4}>
                        {renderCartReviewCard()}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ProductReview;
