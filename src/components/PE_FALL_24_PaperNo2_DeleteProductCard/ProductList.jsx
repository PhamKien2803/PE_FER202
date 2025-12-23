import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  //Tách ra 2 state để lưu giá trị của radio button cho brand và category riêng biệt
  const [radioValueBrand, setRadioValueBrand] = useState(0);
  const [radioValueCategory, setRadioValueCategory] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    axios.get("/product")
      .then((response) => setProducts(response.data))
      .catch((err) => console.log(err));

    axios.get("/brand")
      .then((response) => setBrands(response.data))
      .catch((err) => console.log(err));

    axios.get("/category")
      .then((response) => setCategories(response.data))
      .catch((err) => console.log(err));
  }, []);


  useEffect(() => {
    const filterProducts = products?.filter((pro) => {
      let matchesBrand = true;
      let matchesCategory = true;
      if (radioValueBrand !== 0) {
        matchesBrand = parseInt(pro?.brand) === radioValueBrand;
      }
      if (radioValueCategory !== 0) {
        matchesCategory = parseInt(pro?.category) === radioValueCategory;
      }
      return matchesBrand && matchesCategory;
    })
    setFilteredProducts(filterProducts);
  }, [products, brands, categories, radioValueBrand, radioValueCategory]);


  const handleRadioChangeBrands = (value) => setRadioValueBrand(parseInt(value));
  const handleRadioChangeCategories = (value) => setRadioValueCategory(parseInt(value));

  const renderCategories = () => {
    return (
      <Form.Group>
        {categories?.map((cate) => (
          <Form.Check
            key={cate?.id}
            type="radio"
            label={cate?.name}
            value={cate?.id}
            checked={radioValueCategory === parseInt(cate?.id)}
            onChange={() => handleRadioChangeCategories(cate?.id)}
          />
        ))}
        <Form.Check
          type="radio"
          label="All Categories"
          value={0}
          checked={radioValueCategory === 0}
          onChange={() => handleRadioChangeCategories(0)}
        />
      </Form.Group>
    );
  }

  const renderBrands = () => {
    return (
      <Form.Group>
        {brands?.map((brand) => (
          <Form.Check
            key={brand?.id}
            type="radio"
            label={brand?.name}
            value={brand?.id}
            checked={radioValueBrand === parseInt(brand?.id)}
            onChange={() => handleRadioChangeBrands(brand?.id)}
          />
        ))}
        <Form.Check
          type="radio"
          label="All Brands"
          value={0}
          checked={radioValueBrand === 0}
          onChange={() => handleRadioChangeBrands(0)}
        />
      </Form.Group>
    );
  };

  const renderProducts = () => {
    return filteredProducts.map((product) => (
      <Col key={product?.id} sm={6} md={4} lg={3} className="mb-4">
        <Card style={{ width: '100%', borderRadius: '10px' }}>
          <Card.Img
            variant="top"
            src={product?.image}
            style={{
              height: "200px",
              objectFit: "contain",
              padding: "10px",
              borderBottom: "1px solid #f0f0f0",
            }}
          />
          <Card.Body style={{ padding: "15px" }}>
            <Card.Title style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1rem", marginBottom: "10px" }}>
              {product?.title}
            </Card.Title>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ fontWeight: "500" }}>Brand:</span>{" "}
              <strong>
                {brands.find((brand) => parseInt(brand?.id) === parseInt(product?.brand))?.name || "Unknown"}
              </strong>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <span style={{ fontWeight: "500" }}>Category:</span>{" "}
              <strong>
                {categories.find((cate) => parseInt(cate?.id) === parseInt(product?.category))?.name || "Unknown"}
              </strong>
            </div>
            <div style={{ textAlign: "center", margin: "10px 0" }}>
              <div style={{ color: "blue", fontSize: "14px" }}>
                Price: <s>${product?.price}</s>
              </div>
              <div style={{ color: "red", fontSize: "14px", margin: "5px 0" }}>
                Discount: {product?.discountPercentage} %
              </div>
              <div style={{ color: "blue", fontSize: "16px", fontWeight: "bold" }}>
                New price: ${Math.ceil(product?.price - (product?.price * (product?.discountPercentage / 100)))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
              <Button as={Link} to={`/product/${product?.id}`} style={{ padding: "5px 8px", backgroundColor: "#4caf50", border: "none" }}>View details</Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  return (
    <Container>
      <Row>
        <Col md={2}>
          <h1>Categories</h1>
          {renderCategories()}
          <h1>Brands</h1>
          {renderBrands()}
        </Col>
        <Col md={10}>
          <Row>
            <h1 style={{ textAlign: "center" }}>List Product</h1>
          </Row>
          <Row className="g-3">{renderProducts()}</Row>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductList
