import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Button, Image } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

function ViewDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios.get(`/product/${id}`)
      .then((response) => setProduct(response.data))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Image src={product?.image} alt={product?.title} style={{ width: '100%' }} />
        </Col>

        <Col md={8}>
          <h3>Product details: {product?.title}</h3>
          <p><strong>Id:</strong> {product?.id}</p>
          <p><strong>Description:</strong> {product?.description}</p>
          <p style={{ textDecoration: 'line-through', color: 'blue' }}>Price: ${product?.price}</p>
          <p style={{ color: 'red' }}>Discount: {product?.discountPercentage}%</p>
          <p><strong>New Price:</strong> ${Math.ceil(product.price - (product.price * (product.discountPercentage / 100)))}</p>
          <p><strong>Rating:</strong> {product.rating}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <Button as={Link} to={"/"} variant="success">Back to list</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ViewDetails;
