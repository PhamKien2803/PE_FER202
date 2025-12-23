import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateProduct() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discountPercentage: "",
    rating: "",
    stock: "",
    brand: "",
    category: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/brand")
      .then((response) => setBrands(response.data))
      .catch((err) => console.log(err));

    axios
      .get("/category")
      .then((response) => setCategories(response.data))
      .catch((err) => console.log(err));
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Please enter the title.";
    if (formData.price <= 0) errors.price = "Price must be greater than 0.";
    if (formData.discountPercentage < 0 || formData.discountPercentage > 100)
      errors.discountPercentage = "The discount rate must be in the range of 0 to 100.";
    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios
      .post("/product", formData)
      .then((response) => {
        console.log(response.data);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: undefined,
    });
  };

  return (
    <Container>
      <Row style={{ textAlign: "center" }}>
        <h1>Create a new product</h1>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>ID</Form.Label>
              <Form.Control type="number" value="Auto Generated" disabled placeholder="0" />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>
                <span>Title</span>
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>
                <span>Price</span>
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">
                {errors.price}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>
                <span>Discount</span>
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                isInvalid={!!errors.discountPercentage}
              />
              <Form.Control.Feedback type="invalid">
                {errors.discountPercentage}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Brand</Form.Label>
              <Form.Select
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col style={{ display: "flex", justifyContent: "end" }}>
            <Button style={{ width: "20%" }} variant="primary" type="submit">
              Add
            </Button>
          </Col>
          <Col style={{ display: "flex", justifyContent: "start" }}>
            <Button style={{ width: "20%" }} variant="danger" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default CreateProduct;
