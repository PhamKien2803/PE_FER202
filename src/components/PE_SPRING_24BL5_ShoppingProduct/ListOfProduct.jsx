import axios from "axios";
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, Card, Button, ListGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

function ListOfProduct() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [status, setStatus] = useState([]);
  const [cart, setCart] = useState([]);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch data
  useEffect(() => {
    // Fetch products
    axios.get("/products")
      .then((response) => setProducts(response.data))
      .catch((err) => console.error("Error fetching products:", err));

    // Fetch brands
    axios.get("/brands")
      .then((response) => setBrands(response.data))
      .catch((err) => console.error("Error fetching brands:", err));

    // Fetch statuses
    axios.get("/status")
      .then((response) => setStatus(response.data))
      .catch((err) => console.error("Error fetching statuses:", err));

    // Fetch cart
    axios.get("/cart")
      .then((response) => setCart(response.data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  // Handle brand selection
  const handleBrandSelection = (brandID) => {
    const parsedID = parseInt(brandID);
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(parsedID)
        ? prevSelected.filter((id) => id !== parsedID)
        : [...prevSelected, parsedID]
    );
  };

  // Filter products when data or selection changes
  useEffect(() => {
    const filtered = products.filter((product) =>
      selectedBrands.length === 0 || selectedBrands.includes(product?.brands)
    );
    setFilteredProducts(filtered);
  }, [products, selectedBrands]);

  // Render brands filter
  const renderBrands = () => {
    return (
      <Form>
        {brands?.map((brand) => (
          <Form.Check
            key={brand?.id}
            value={brand?.id}
            label={brand?.name}
            type="checkbox"
            onChange={() => handleBrandSelection(brand?.id)}
            className="px-5"
          />
        ))}
      </Form>
    );
  };

  // Render products
  const renderProducts = () => {
    if (filteredProducts?.length === 0) {
      return <p style={{ textAlign: "center", color: "red" }}>No products available</p>;
    }

    return filteredProducts.map((product) => (
      <Col key={product?.id} sm={6} md={4} lg={4} className="mb-4">
        <Card style={{ width: "18rem", height: "100%" }}>
          <Card.Img
            variant="top"
            src={product?.images?.[0]}
            style={{ height: "12rem" }}
          />
          <Card.Body>
            <Card.Title>{product?.name}</Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>Price: {product?.price} vnđ</ListGroup.Item>
            <ListGroup.Item>
              Brand: {brands.find((brand) => parseInt(brand?.id) === parseInt(product?.brands))?.name}
            </ListGroup.Item>
            <ListGroup.Item>
              Status:{" "}
              <span
                style={product?.status === 1 ? { color: "green" } : { color: "red" }}
              >
                {status.find((sta) => parseInt(sta?.id) === parseInt(product?.status))?.name}
              </span>
            </ListGroup.Item>
          </ListGroup>
          <Card.Body>
            <Button
              as={Link}
              to={`/product/${product?.id}`}
              style={{ marginRight: "1rem" }}
              variant="danger"
            >
              Details
            </Button>
            <Button variant="success">Add to Cart</Button>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  // Render UI
  return (
    <>
      <h1 style={{ textAlign: "center" }}>ABC Shop</h1>
      <Container style={{ marginTop: "2rem" }}>
        <Row>
          {/* Filter Column */}
          <Col md={3}>
            <h3>Filter by Brands:</h3>
            {renderBrands()}
          </Col>
          {/* Products Column */}
          <Col md={9}>
            <Row style={{ marginBottom: "2rem" }}>
              <h5
                style={{ textAlign: "right", cursor: "pointer" }}
                onClick={() => navigate("/cart")}
              >
                Cart[<span style={{ color: "blue" }}>{cart?.length || 0}</span>]
              </h5>
            </Row>
            <Row>{renderProducts()}</Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListOfProduct;
