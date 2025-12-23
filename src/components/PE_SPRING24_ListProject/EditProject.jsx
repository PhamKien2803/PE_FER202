import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

const formData = {
  name: "",
  description: "",
  startDate: "",
  type: "",
  department: "",
}

function EditProject() {
  const { id } = useParams();
  const [projects, setProjects] = useState([formData]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios.get('/departments')
      .then((response) => setDepartments(response.data))
      .catch((err) => console.log(err));

    axios.get(`/projects/${id}`)
      .then((response) => setProjects(response.data))
      .catch((err) => console.log(err));
  }, [id])

  const handleChangeValue = (e) => { //Thay đổi dữ liệu trong form
    const { name, value } = e.target;
    setProjects((preProject) => {
      return {
        ...preProject,
        [name]: value
      }
    })
  }

  const handleSubmmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      if (!projects?.name) {
        alert("Please enter the form fields that are required.");
        return;
      }

      const request = await axios.put(`/projects/${id}`, projects);
      if (request.status === 200) {
        alert("Update Success");
        window.location.href = "/";
      }

    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <h1 className="text-center">Edit Project</h1>
      <Container>
        <Row>
          <Link to={"/"}>Home Page</Link>
        </Row>
        <Row>
          <Form onSubmit={handleSubmmit}>

            <Form.Group className="mb-3 mt-4" >
              <Form.Label>Project Name</Form.Label>
              <Form.Control type="text" name="name" onChange={handleChangeValue} value={projects?.name} />
              <Form.Control.Feedback type="invalid">
                Please provide a project name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" rows={4} as="textarea" onChange={handleChangeValue} value={projects?.description} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control name="startDate" rows={4} type="date" onChange={handleChangeValue} value={projects?.startDate} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control name="type" rows={4} type="text" onChange={handleChangeValue} value={projects?.type} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select name="department" rows={4} onChange={handleChangeValue} value={projects?.department} >
                {departments?.map((dep) => (
                  <option value={dep?.id} key={dep?.id}>{dep?.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Button type="submit">Update</Button>
          </Form>
        </Row>
      </Container>
    </>
  )
}

export default EditProject
