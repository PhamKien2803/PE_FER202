import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Container, Form, Row, Table } from 'react-bootstrap';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [selectProduct, setSelectProduct] = useState(null);
    const [filterProducts, setFilterProducts] = useState([]);
    const [radioValue, setRadioValue] = useState("");
    const [reviewerName, setReviewerName] = useState("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        axios.get('/products')
            .then((response) => setProducts(response.data))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        const filterProduct = products?.filter((pro) => {
            let matchesSearch = true;

            if (searchValue) {
                matchesSearch = pro?.title?.toLowerCase().includes(searchValue?.toLowerCase());
            }
            return matchesSearch;
        });
        setFilterProducts(filterProduct);
    }, [searchValue, products]);

    const handleViewProduct = (id) => {
        const product = products?.find((pro) => pro?.id === id);
        setSelectProduct(product);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const handleAddReview = () => {
        if (!reviewerName || !comment || !radioValue) {
            alert("All fields are required!");
            return;
        }

        const newReview = {
            reviewerName,
            comment,
            date: new Date().toISOString(),
            rating: Number(radioValue),
        };

        const updatedProduct = {
            ...selectProduct,
            reviews: [...(selectProduct?.reviews || []), newReview],
        };

        axios.put(`/products/${selectProduct.id}`, updatedProduct)
            .then(() => {
                setProducts((prevProducts) => prevProducts.map((p) => (p.id === selectProduct.id ? updatedProduct : p)));
                setSelectProduct(updatedProduct);
                setReviewerName("");
                setComment("");
                setRadioValue("");
            })
            .catch((err) => console.log(err));
    };

    const handleClearReviews = () => {
        const updatedProduct = {
            ...selectProduct,
            reviews: [],
        };

        axios.put(`/products/${selectProduct.id}`, updatedProduct)
            .then(() => {
                setProducts((prevProducts) => prevProducts.map((p) => (p.id === selectProduct.id ? updatedProduct : p)));
                setSelectProduct(updatedProduct);
            })
            .catch((err) => console.log(err));
    };

    const renderProductList = () => {
        return (
            <Table className='mt-2' hover striped bordered>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Functions</th>
                    </tr>

                </thead>
                <tbody>
                    {filterProducts?.map((pro) => (
                        <tr key={pro?.id}>
                            <td>{pro?.id}</td>
                            <td>{pro?.title}</td>
                            <td>{pro?.category}</td>
                            <td>{pro?.price}</td>
                            <td>
                                <button onClick={() => handleViewProduct(pro?.id)}>View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    return (
        <>
            <Container>
                <Row>
                    <Col md={6}>
                        <h1>Product List</h1>
                        <input placeholder='Enter title search ... ' type='text' className='form-control' onChange={(e) => setSearchValue(e.target.value)} />
                        {renderProductList()}
                    </Col>
                    <Col md={6}>
                        <Row style={{ marginTop: "3.5rem" }}>
                            <span><strong>Reviews details:</strong></span>
                        </Row>
                        {selectProduct ? (
                            <div>
                                <span>ProductId: {selectProduct?.id}</span><br />
                                <span>Title: {selectProduct?.title}</span><br />
                                <span>Category: {selectProduct?.category}</span><br />
                                <span>Price: {selectProduct?.price}</span>
                                <hr style={{ border: "0.5px solid black" }} />
                                <span><strong>Add a new review</strong></span><br />
                                <span>Reviewer Name</span><br />
                                <input
                                    required
                                    placeholder='Enter Reviewer name'
                                    type='text'
                                    className='form-control mt-2'
                                    value={reviewerName}
                                    onChange={(e) => setReviewerName(e.target.value)}
                                /><br />
                                <span>Comment</span><br />
                                <input
                                    placeholder='Enter comment'
                                    type='text'
                                    className='form-control mt-2'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                /><br />

                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ marginRight: "1rem" }}>Rating:</span>
                                    <Form.Group style={{ display: "flex", gap: "1.5rem" }}>
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <Form.Check
                                                key={val}
                                                label={val}
                                                type="radio"
                                                value={val}
                                                checked={radioValue === val.toString()}
                                                onChange={(e) => setRadioValue(e.target.value)}
                                            />
                                        ))}
                                    </Form.Group>
                                </div>

                                <button onClick={handleAddReview}>Add Review</button>

                                <hr style={{ border: "0.5px solid black" }} />
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>ReviewerName</th>
                                            <th>Comment</th>
                                            <th>Date</th>
                                            <th>Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectProduct?.reviews?.map((re, index) => (
                                            <tr key={index}>
                                                <td>{re?.reviewerName}</td>
                                                <td>{re?.comment}</td>
                                                <td>{formatDate(re?.date)}</td>
                                                <td>{re?.rating}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <hr style={{ border: "0.5px solid black" }} />
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button onClick={handleClearReviews}>Clear Reviews</button>
                                </div>

                            </div>
                        ) : (
                            <p>Please select a product!</p>
                        )}
                    </Col>
                </Row>
            </Container>

        </>
    );
}

export default ProductList;
