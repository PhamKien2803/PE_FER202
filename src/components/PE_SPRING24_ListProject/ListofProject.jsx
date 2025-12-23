import React, { useState, useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Table from "react-bootstrap/Table";
import axios from 'axios';
import { Link } from 'react-router-dom';
function ListofProject() {
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [radioValue, setRadioValue] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [selectDepartment, setSelectDepartment] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState([]);


  useEffect(() => {
    axios.get('/departments')
      .then((response) => setDepartments(response.data))
      .catch((err) => console.log(err));

    axios.get('/projects')
      .then((response) => setProjects(response.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const filterDepartments = projects?.filter((pro) => {
      let matchesDepartment = true;
      let matchesSearch = true;
      let matchesCheckBox = true;

      if(searchValue){
        matchesSearch = pro?.name.toLowerCase().includes(searchValue.toLowerCase());
      }

      if (radioValue !== 0) {
        matchesDepartment = pro?.department === radioValue;
      }
      if (selectDepartment.length) {
        matchesCheckBox = selectDepartment.includes(String(pro?.department));
      }
      return matchesDepartment && matchesSearch && matchesCheckBox;
    })
    setFilterDepartment(filterDepartments);
  }, [projects, radioValue, selectDepartment, searchValue]);

  const handleRadioChange = (value) => {
    setRadioValue(parseInt(value));
  }

  const renderDepartment = () => {
    return (
      <Form.Group>
        <Form.Check
          type="radio"
          label="All"
          value={0}
          checked={radioValue === 0}
          onChange={() => handleRadioChange(0)}
        />

        {departments?.map((dept) => (
          <Form.Check
            key={dept?.id}
            type="radio"
            label={dept?.name}
            value={dept?.id}
            checked={radioValue === parseInt(dept?.id)}
            onChange={() => handleRadioChange(dept?.id)}
          />
        ))}
      </Form.Group>
    );

  }

  const renderTableProject = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Project Name</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>Type</th>
            <th>Department</th>
            <th>Function</th>
          </tr>
        </thead>
        <tbody>
          {filterDepartment?.map((pro) => (
            <tr key={pro?.id}>
              <td>{pro?.id}</td>
              <td>{pro?.name}</td>
              <td>{pro?.description}</td>
              <td>{pro?.startDate}</td>
              <td>{pro?.type}</td>
              <td>
                <Link to={`/departments/${pro?.department}/employees`}>
                  {
                    departments?.find((dep) => parseInt(dep?.id) === parseInt(pro?.department))?.name
                  }
                </Link>

              </td>
              <td><Link to={`/projects/edit/${pro?.id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }

  const handleSelectDepartment = (id) => {
    setSelectDepartment((prevDep) => {
      return prevDep.includes(id)
        ? prevDep?.filter((dep) => dep !== id)
        : [...prevDep, id];
    })
  }

  const renderDepartmant = () => {
    return departments?.map((dep) => (
      <Form.Check
        key={dep?.id}
        type='checkbox'
        label={dep?.name}
        onChange={() => handleSelectDepartment(dep?.id)}
      />
    ))
  }
  return (
    <>
      <h1 style={{ textAlign: "center" }}>List of Projects</h1>
      <Container>
        <Row style={{display: "flex", justifyContent: "center"}}>
          <input style={{width: "50%"}} placeholder='Enter project name to search ...' onChange={(e) => setSearchValue(e.target.value)} className='form-control' type='text' />
        </Row>
        <Row style={{ marginTop: "2rem" }}>
          <Col md={3}>
            <h3>Departments</h3>
            {renderDepartment()}
            <hr style={{ border: "2px dotted black" }} />
            <h3>Filter By Department:</h3>
            {renderDepartmant()}
          </Col>
          <Col md={9}>
            {renderTableProject()}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default ListofProject
