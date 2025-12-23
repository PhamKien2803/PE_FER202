import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

function ListProduct() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [radioValue, setRadioValue] = useState(0);
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
        const filterProducts = () => {
            return products.filter((product) => {
                const productBrand = brands.find(
                    (brand) => parseInt(brand?.id) === parseInt(product?.brand)
                );
                console.log(productBrand);
                // Filter by brand (radio filter)
                const matchesBrand =
                    radioValue === 0 || parseInt(product?.brand) === radioValue;
                //matches the search term
                const matchesSearchTerm =
                    search === "" ||
                    product.title.toLowerCase().includes(search.toLowerCase());
                return matchesBrand && matchesSearchTerm;
            });
        };
        setFilteredProducts(filterProducts());
    }, [brands, products, radioValue, search]);

    const handleRadioChange = (value) => setRadioValue(parseInt(value));

    const renderBrands = () => {
        return (
            <Form.Group>
                {brands.map((brand) => (
                    <Form.Check
                        key={brand.id}
                        type="radio"
                        label={brand.name}
                        value={brand.id}
                        checked={radioValue === parseInt(brand.id)}
                        onChange={() => handleRadioChange(brand.id)}
                    />
                ))}
                <Form.Check
                    type="radio"
                    label="All Brands"
                    value={0}
                    checked={radioValue === 0}
                    onChange={() => handleRadioChange(0)}
                />
            </Form.Group>
        );
    };

    const renderProducts = () => {
        return filteredProducts.map((product) => (
            <Col key={product.id} sm={6} md={4} lg={3} className="mb-4">
                <Card style={{ width: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                    <Card.Img
                        variant="top"
                        src={product.image}
                        style={{
                            height: "200px",
                            objectFit: "contain",
                            padding: "10px",
                            borderBottom: "1px solid #f0f0f0",
                        }}
                    />
                    <Card.Body style={{ padding: "15px" }}>
                        <Card.Title style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1rem", marginBottom: "10px" }}>
                            {product.title}
                        </Card.Title>
                        <div style={{ marginBottom: "8px" }}>
                            <span style={{ fontWeight: "500" }}>Brand:</span>{" "}
                            <strong>
                                {brands.find((brand) => parseInt(brand.id) === parseInt(product.brand))?.name || "Unknown"}
                            </strong>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                            <span style={{ fontWeight: "500" }}>Category:</span>{" "}
                            <strong>
                                {categories.find((cate) => parseInt(cate.id) === parseInt(product.category))?.name || "Unknown"}
                            </strong>
                        </div>
                        <div style={{ textAlign: "center", margin: "10px 0" }}>
                            <div style={{ color: "blue", fontSize: "14px" }}>
                                Price: <s>${product.price}</s>
                            </div>
                            <div style={{ color: "red", fontSize: "14px", margin: "5px 0" }}>
                                Discount: {product.discountPercentage} %
                            </div>
                            <div style={{ color: "blue", fontSize: "16px", fontWeight: "bold" }}>
                                New price: ${Math.ceil(product.price - (product.price * (product.discountPercentage / 100)))}
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                            <Button as={Link} to={`/product/${product.id}`} variant="success" style={{ width: "80%" }}>View details</Button>
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
                    <h1>Brands</h1>
                    {renderBrands()}
                </Col>
                <Col md={10}>
                    <Row>
                        <h1 style={{ textAlign: "center" }}>List Product</h1>
                    </Row>
                    <Row style={{ marginTop: "2rem" }}>
                        <div style={{ justifyContent: "center", display: "flex", marginBottom: "3%" }}>
                            <input
                                style={{ width: "70%", padding: "8px", fontSize: "16px" }}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Enter title to search ..."
                            />
                        </div>
                    </Row>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button as={Link} to={"/product/add"} variant="warning" style={{ width: "20%", padding: "8px" }}>Create a new Product</Button>
                    </div>
                    <Row className="g-3">{renderProducts()}</Row>
                </Col>
            </Row>
        </Container>
    );
}

export default ListProduct;
