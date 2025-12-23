import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

function OrderDetails() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateTotal = (products) => {
    return products.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const renderProductList = (products) => {
    return (
      <div>
        {products.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: '10px',
            }}
          >
            <span>{item.id} {item.name}</span>
            <span style={{ textAlign: 'right' }}>{item.price.toFixed(2)}</span>
            <span style={{ textAlign: 'right' }}>{item.quantity}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Order History</h1>
      <Table bordered striped>
        <thead>
          <tr>
            <th>OrderId</th>
            <th>OrderDate</th>
            <th>ShipAddress</th>
            <th>ProductList</th>
            <th>TotalPrice ($)</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{formatDate(order.orderDate)}</td>
              <td>{order.shipAddress}</td>
              <td>{renderProductList(order.products)}</td>
              <td>{calculateTotal(order.products)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default OrderDetails;
