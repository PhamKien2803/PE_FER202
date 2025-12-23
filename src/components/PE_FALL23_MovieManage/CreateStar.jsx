import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'

function CreateStar() {
  return (
    <>
      <Container>
        <Row>
          <h2>Create a new Star</h2>
        </Row>
        <Form style={{ marginTop: "2%", marginLeft: "2%" }}>
          <Row style={{ marginBottom: "2%" }}>
            <Col>
              <Form.Group style={{ maxWidth: "100%" }}>
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="number"
                  value="Auto Generated"
                  disabled
                  placeholder="0"
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group style={{ maxWidth: "100%" }}>
                <Form.Label>
                  <span>Fullname</span>
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control type="text" name="title" />
                <Form.Control.Feedback type="invalid">
                  Fullname is requierd
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row style={{ marginBottom: "2%" }}>
            <Col>
              <Form.Group style={{ maxWidth: "100%" }}>
                <Form.Label>Date of birth</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group style={{ maxWidth: "100%" }}>
                <Form.Label>Gender</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Male"
                    type="radio"
                    name="gender"
                    id="gender-male"
                  />
                  <Form.Check
                    inline
                    label="Female"
                    type="radio"
                    name="gender"
                    id="gender-female"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row style={{ marginBottom: "2%" }}>
            <Col>
              <Form.Group style={{ maxWidth: "100%" }}>
                <Form.Label>Nationality</Form.Label>
                <Form.Select name="brand">
                  <option value="">-- Select --</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group style={{ maxWidth: "100%" }}>
                <Form.Label>
                  <span>Description</span>
                </Form.Label>
                <Form.Control type="text" name="title" />
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
              <Button
                style={{ width: "10%" }}
                variant="danger"

              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  )
}

export default CreateStar
