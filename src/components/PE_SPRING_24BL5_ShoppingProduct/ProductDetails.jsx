import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function ProductPage() {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [products, setProducts] = useState({});
  const [brands, setBrands] = useState([]);
  const [status, setStatus] = useState([]);
  const [imageSrc, setImageSrc] = useState();

  useEffect(() => {
    if (products?.images && products?.images.length) {
      setImageSrc(products?.images[0]);
    }
  }, [products]);

  // Fetch data
  useEffect(() => {

    axios.get(`/products/${id}`)
      .then((response) => setProducts(response.data))
      .catch((err) => console.error("Error fetching products:", err));

    axios.get("/brands")
      .then((response) => setBrands(response.data))
      .catch((err) => console.error("Error fetching brands:", err));

    axios.get("/status")
      .then((response) => setStatus(response.data))
      .catch((err) => console.error("Error fetching statuses:", err));

  }, [id]);

  const convertMoney = (price = 0) => {
    if (price) return price.toLocaleString("vi-VN").replaceAll(".", ",");
    return price;
  };
  return (
    <>
      <div style={{ margin: "0 5%" }}>
        <h1 className="my-2" style={{ textAlign: "center", color: "green" }}>
          PRODUCT DETAILS
        </h1>
        <Button
          variant="success"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          Go to Home
        </Button>
        <h4>{products?.name}</h4>
        <div className="d-flex">
          <div>
            <img
              src={`/${imageSrc}`}
              style={{
                width: "500px",
                height: "500px",
                marginBottom: "2%",
                border: "2px solid grey",
              }}
              alt="thumbnail"
            />
            <div
              className="d-flex"
              style={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                padding: "10px 12px",
                justifyContent: "center",
              }}
            >
              {products?.images?.map((item, index) => (
                <img
                  key={index}
                  src={`/${item}`}
                  alt="thumbnail"
                  onMouseOver={() => setImageSrc(item)}
                  style={
                    imageSrc === item
                      ? {
                        width: "100px",
                        height: "60px",
                        margin: "0 2%",
                        cursor: "pointer",
                        border: "1px solid green",
                      }
                      : {
                        width: "100px",
                        height: "60px",
                        margin: "0 2%",
                        cursor: "pointer",
                      }
                  }
                />
              ))}
            </div>
          </div>
          <div style={{ width: "3%" }}></div>
          <div>
            <h4>Price: {products?.price ? convertMoney(products?.price) : 0} vnđ</h4>
            <h6>Brand: {brands.find(
              (item) => parseInt(item.id) === parseInt(products?.brands)
            )?.name}</h6>
            <h4>
              Status:{" "}
              <span
                style={
                  products?.status === 1 ? { color: "green" } : { color: "red" }
                }
              >
                {status.find(
                  (item) => parseInt(item.id) === parseInt(products?.status)
                )?.name}
              </span>
            </h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
