import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Col, Container, Form, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [selectSubject, setselectSubject] = useState(null);
  const [filterSubject, setfilterSubject] = useState(null);

  const [newSubjectId, setNewSubjectId] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");

  useEffect(() => {
    axios
      .get("/students")
      .then((response) => setStudents(response.data))
      .catch((err) => console.log(err));

    axios
      .get("/student_details")
      .then((response) => setStudentDetails(response.data))
      .catch((err) => console.log(err));

    axios
      .get("/students_subjetcs")
      .then((response) => setStudentSubjects(response.data))
      .catch((err) => console.log(err));

    axios
      .get("/subjects")
      .then((response) => setSubjects(response.data))
      .catch((err) => console.log(err));
  }, []);


  const renderSubjects = () => {
    return (
      <ul style={{ marginLeft: "10%" }}>
        <li>
          <Link to="#" onClick={() => setselectSubject("")}>
            All Subjects
          </Link>
        </li>
        {subjects.map((sub) => (
          <li key={sub?.id}>
            <Link
              to={`/student?subject=${sub?.subjectId}`}
              onClick={() => setselectSubject(sub?.subjectId)}
            >
              {sub?.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  const createSubject = () => {
    return (
      <div>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter Subject ID"
              value={newSubjectId}
              onChange={(e) => setNewSubjectId(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter Subject Name"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
            />
          </Form.Group>
        </Form>
        <button onClick={addSubject}>Add</button>
      </div>
    );
  }

  const addSubject = async () => {
    try {
      await axios.post("/subjects", {
        id: "s" + Math.floor(Math.random() * 1000),
        subjectId: newSubjectId,
        name: newSubjectName,
      });
      setSubjects([...subjects, { subjectId: newSubjectId, name: newSubjectName }]);
      setNewSubjectId("");
      setNewSubjectName("");

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const filterStudentSubjects = students?.filter((stu) => {
      let matchesSubject = true;
      let matchesSearch = true;
      if (selectSubject) {
        matchesSubject = studentSubjects?.find(
          (sub) => sub.studentId === stu.studentId && sub.subjectId === selectSubject
        );
      }
      if (searchValue) {
        matchesSearch = stu.name.toLowerCase().includes(searchValue.toLowerCase());
      }
      return matchesSubject && matchesSearch;
    })
    setfilterSubject(filterStudentSubjects);
  }, [students, selectSubject, searchValue, studentSubjects]);


  const renderStudentInformation = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>StudentId</th>
            <th>Name</th>
            <th>Age</th>
            <th>Street</th>
            <th>City</th>
            <th>IsRegularStudent</th>
            <th>View grades</th>
          </tr>
        </thead>
        <tbody>
          {filterSubject?.map((stu) => {
            const studentDetail = studentDetails.find(
              (detail) => detail.studentId === stu.studentId
            );

            const isRegularStudent = stu.isRegularStudent
              ? "Fulltime"
              : "Applicant";

            return (
              <tr key={stu.studentId}>
                <td>{stu.studentId}</td>
                <td>{stu.name}</td>
                <td>{stu.age}</td>
                <td>{studentDetail ? studentDetail.address.street : "N/A"}</td>
                <td>{studentDetail ? studentDetail.address.city : "N/A"}</td>
                <td>{isRegularStudent}</td>
                <td>
                  <Link to={`/student/${stu.studentId}`}>Grades</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
  return (
    <>
      <Container>
        <Row>
          <h1 style={{ textAlign: "center", marginTop: "1rem" }}>Students Management</h1>
        </Row>
        <Row
          style={{
            justifyContent: "center",
            display: "flex",
            marginBottom: "3%",
          }}>
          <Form.Control onChange={(e) => setSearchValue(e.target.value)} style={{ width: "70%", padding: "5px", fontSize: "16px" }} type='text' placeholder='Enter student name to search ...' />
        </Row>
        <Row>
          <Col md={3}>
            <Row>
              <h2>Subjects</h2>
            </Row>
            {renderSubjects()}
            {createSubject()}
          </Col>
          <Col md={9}>
            <Row>
              <h2>List of Students</h2>
            </Row>
            {renderStudentInformation()}
          </Col>
        </Row>
        <hr style={{ color: "gray", width: "100%", border: "solid 2px" }}></hr>
        <Row>
          <h5 style={{ textAlign: "center" }}>Copyright by: HE17xxxx</h5>
        </Row>
      </Container>
    </>
  )
}

export default StudentList
