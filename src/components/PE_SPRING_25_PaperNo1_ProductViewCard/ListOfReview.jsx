import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap';

function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', options).replace(',', '');
}

function ListOfReview() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('/products') 
            .then((res) => setProducts(res.data))
            .catch((err) => console.error("Error fetching products:", err));
    }, []);

    return (
        <Container className="mt-4">
            <h2>List of Reviews</h2>
            <Table bordered responsive>
                <thead>
                    <tr>
                        <th>ProductId</th>
                        <th>Title</th>
                        <th>Reviews</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.title}</td>
                            <td>
                                <Table bordered size="sm" className="mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: '25%' }}>Date</th>
                                            <th style={{ width: '20%' }}>Reviewer</th>
                                            <th style={{ width: '40%' }}>Comment</th>
                                            <th style={{ width: '15%' }}>Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                                            product.reviews.map((review, index) => (
                                                <tr key={index}>
                                                    <td>{formatDate(review.date)}</td>
                                                    <td>{review.reviewerName}</td>
                                                    <td>{review.comment}</td>
                                                    <td>{review.rating}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center">No reviews</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default ListOfReview;
