import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OrderProduct() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [addtoCart, setAddToCart] = useState([]);
    const [shipAddress, setShipAddress] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [selectCategory, setSelectCategory] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);



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

        if (existingItem) {
            const updatedCart = addtoCart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setAddToCart(updatedCart);
        } else {
            const newItem = {
                id: product.id,
                name: product.title,
                price: product.price,
                quantity: 1
            };
            setAddToCart([...addtoCart, newItem]);
        }
    };

    const handleRemove = (id) => {
        const updatedCart = addtoCart.filter((item) => item.id !== id);
        setAddToCart(updatedCart);
    };

    const handlePlaceOrder = async () => {
        if (!shipAddress.trim()) {
            return;
        }

        const newOrder = {
            orderDate: new Date().toISOString(),
            shipAddress: shipAddress,
            products: addtoCart
        };

        try {
            await axios.post('/orders', newOrder);
            setAddToCart([]);
            setShipAddress('');
            setOrderPlaced(true);
        } catch (error) {
            console.error("Error placing order:", error);
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



    const renderTableProduct = () => {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th style={{ width: "30%" }}>Title</th>
                        <th style={{ width: "15%" }}>Category</th>
                        <th style={{ width: "10%" }}>Price</th>
                        <th style={{ width: "10%" }}>Rate</th>
                        <th style={{ width: "20%" }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts?.map((pro) => (
                        <tr key={pro?.id}>
                            <td>{pro?.title}</td>
                            <td>{pro?.category}</td>
                            <td>{pro?.price}</td>
                            <td>
                                {pro?.reviews && pro.reviews.length > 0
                                    ? (
                                        pro.reviews.reduce((sum, review) => sum + review.rating, 0) / pro.reviews.length
                                    ).toFixed(2)
                                    : "No rating"}
                            </td>
                            <td>
                                <Button onClick={() => handleAddtoCart(pro?.id)} variant="primary" size="sm">
                                    Add To Cart
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    const renderCartOrder = () => {
        return (
            <Card style={{ border: '2px solid lightgray', minHeight: '420px' }}>
                <Card.Title className='text-center'><h4>Cart</h4></Card.Title>
                <Card.Body className="d-flex flex-column justify-content-between">
                    {addtoCart.length > 0 ? (
                        <>
                            <Table size="sm">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addtoCart.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                <Button variant="danger" size="sm" onClick={() => handleRemove(item.id)}>
                                                    Remove
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <Form.Group className="mb-3" controlId="shippingAddress">
                                <Form.Label><strong>Ship Address</strong></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder="VD: Số 1 Võ Văn Ngân, ĐH FPT, Hà Nội"
                                    value={shipAddress}
                                    onChange={(e) => setShipAddress(e.target.value)}
                                />

                                <div className="d-flex justify-content-end mt-2">
                                    <Button variant="warning" onClick={handlePlaceOrder}><strong>Place Order</strong></Button>
                                </div>

                            </Form.Group>
                        </>
                    ) : (
                        <div style={{ flex: 1 }}>
                            <strong>Your cart is empty!</strong>
                            {orderPlaced && (
                                <div style={{ color: "#00b300" }} className="mt-2">
                                    <h2>Thank you for your order!</h2>
                                    <strong>Your order has been placed successfully.</strong>
                                </div>
                            )}
                        </div>
                    )}
                </Card.Body>
            </Card>
        );
    };

    return (
        <>
            <h1 style={{ textAlign: "center", marginTop: "1rem" }}>Shopping System</h1>
            <Container fluid style={{ width: "95%" }}>
                <Row className="align-items-center mb-3">
                    <Col md={6}>
                        {renderSelectCategory()}
                    </Col>
                    <Col md={6} className="d-flex justify-content-end">
                        <Button onClick={() => navigate('/orders')} variant="success">Order History</Button>
                    </Col>
                </Row>

                <Row>
                    <Col md={8}>
                        {renderTableProduct()}
                    </Col>
                    <Col md={4}>
                        {renderCartOrder()}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default OrderProduct;
