import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Button, Container, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function ShoppingCart() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    axios.get('/cart')
      .then((response) => setCart(response.data))
      .catch((err) => console.log(err));
  }, [])

  const clearCart = async () => {
    try {
      const request = await axios.delete('/cart')
      if (request.status === 200) {
        setCart([])
      }
    } catch (e) {
      console.log(e)
    }
  }

  const convertMoney = (price = 0) => {
    if (price) return price.toLocaleString("vi-VN").replaceAll(".", ",");
    return price;
  };

  const totalCart = cart.reduce((initialValue, nextValue) => {
    return initialValue + nextValue?.price * nextValue?.quantity;
  }, 0);


  const renderCart = () => {
    return (
      <>
        {cart.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product Id</th>
                  <th>Product Name</th>
                  <th>Image</th>
                  <th>Price (vnđ)</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart?.map((car) => (
                  <tr key={car?.id}>
                    <td>{car?.id}</td>
                    <td>{car?.name}</td>
                    <td>
                      <img
                        src={car?.images[0]}
                        style={{ height: "80px" }}
                        alt={car?.name}
                      />
                    </td>
                    <td>{car?.price ? convertMoney(car?.price) : 0}</td>
                    <td>{car?.quantity}</td>
                    <td>
                      {
                        car?.price * car?.quantity ? convertMoney(car?.price * car?.quantity) : 0
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div style={{ textAlign: "right" }}>
              <h6>VAT: 8%</h6>
              <h6>TOTAL: {totalCart ? convertMoney(totalCart) : 0} vnđ</h6>
              <h6>
                TOTAL(VAT):{" "}
                {totalCart ? convertMoney((totalCart * 108) / 100) : 0}
                vnđ
              </h6>
            </div>
          </>
        ) : (
          <h4 style={{ color: "red", textAlign: "center" }}>EMPTY CART</h4 >
        )
        }
      </>
    )
  }
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Shopping Cart</h1>
      <Container>
        <Row>
          <Button style={{ width: "9%" }} variant='success' as={Link} to={"/"}>Go to Home</Button>
        </Row>
        <Row>
          <p
            onClick={clearCart}
            style={{
              textAlign: "right",
              textDecoration: "underline",
              color: "blue",
              cursor: "pointer",
            }}
          >
            Clear cart
          </p>
        </Row>
        <Row>
          {renderCart()}
        </Row>
      </Container>
    </>
  )
}

export default ShoppingCart
