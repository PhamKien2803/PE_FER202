import Button from "react-bootstrap/Button";
import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

function Header() {
    return (
        <>
            <Container>
                <h1 className="text-center mt-3 mb-4">Dashboard</h1>
                <div className="d-flex justify-content-center">
                    <Button as={Link} to={"/directors"} className="m-2" style={{ width: "110px", padding: "10px", backgroundColor: "#19ab19" }}>Directors</Button>
                    <Button as={Link} to={"/producers"} className="m-2" style={{ width: "110px", padding: "10px" }} variant="info">Producers</Button>
                    <Button as={Link} to={"/star"} className="m-2" style={{ width: "70px", padding: "10px" }} variant="danger">Stars</Button>
                    <Button as={Link} to={"/genres"} className="m-2" style={{ width: "110px", padding: "10px" }} variant="secondary">Genres</Button>
                    <Button as={Link} to={"/movie"} className="m-2" style={{ width: "110px", padding: "10px" }} variant="warning">Movies</Button>
                </div>
            </Container>
        </>
    )
}

export default Header
