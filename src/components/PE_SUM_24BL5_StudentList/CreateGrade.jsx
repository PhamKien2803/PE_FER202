import React, { useState, useEffect } from 'react'
import { Container, Row, Form, Col, Button, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function CreateGrade() {
  const { studentid } = useParams();
  const [searchValue, setSearchValue] = useState("");
  const [selectSubject, setselectSubject] = useState(null);
  const [filterSubject, setfilterSubject] = useState(null);
  console.log(filterSubject);

  const [students, setStudents] = useState([]);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [newGrade, setNewGrade] = useState("");
  const [newExplanation, setNewExplanation] = useState("");

  useEffect(() => {
    axios
      .get("/students")
      .then((response) => setStudents(response.data))
      .catch((err) => console.log(err));

    axios
      .get("/subjects")
      .then((response) => setSubjects(response.data))
      .catch((err) => console.log(err));

    axios
      .get("/students_subjetcs")
      .then((response) => setStudentSubjects(response.data))
      .catch((err) => console.log(err));

    axios
      // lấy theo kiểu query params ( ? ) => để thông tin để lọc hoặc truy vấn
      //còn params thì lấy theo dạng /:id => để lấy thông tin cụ thể truy vấn
      .get(`/evaluations?studentId=${studentid}`)
      .then((response) => setEvaluations(response.data))
      .catch((err) => console.log(err));
  }, [studentid]);

  useEffect(() => {
    const filterStudentSubjects = students?.filter((stu) => {
      let matchesSubject = true;
      let matchesSearch = true;

      if (selectSubject) {
        matchesSubject = studentSubjects.find((sub) => sub?.studentId === stu?.studentId && sub?.subjectId === selectSubject);
      }

      if (searchValue) {
        matchesSearch = stu?.name.toLowerCase().includes(searchValue.toLowerCase())
      }
      return matchesSubject && matchesSearch;
    })
    setfilterSubject(filterStudentSubjects)
  }, [students, selectSubject, searchValue, studentSubjects]);

  const findStudentid = evaluations.length > 0 ? evaluations[0]?.studentId : null;
  const StudentName = students?.find((stu) => stu?.studentId === findStudentid)?.name;

  const handleAddGrade = async () => {
    try {
      await axios.post("/evaluations", {
        id: "ev" + Math.floor(Math.random() * 1000),
        studentId: studentid,
        grade: parseFloat(newGrade),
        additionalExplanation: newExplanation,
      });
      setEvaluations([...evaluations, { grade: parseFloat(newGrade), additionalExplanation: newExplanation }]);
      setNewGrade("");
      setNewExplanation("");
    } catch (error) {
      console.log(error);

    }
  }
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
  };

  const addGradeStudent = () => (
    <Form style={{ marginBottom: "3%" }}>
      <Row>
        <Col>
          <Form.Control
            type="number"
            placeholder="Enter grade"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
          />
        </Col>
        <Col>
          <Form.Control
            type="text"
            placeholder="Enter additional explanation"
            value={newExplanation}
            onChange={(e) => setNewExplanation(e.target.value)}
          />
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleAddGrade}>
            Add new
          </Button>
        </Col>
      </Row>
    </Form>
  );

  const renderGradeStudent = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Grade</th>
            <th>Explanation</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation) => (
            <tr key={evaluation?.id}>
              <td>{evaluation?.grade}</td>
              <td>{evaluation?.additionalExplanation}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <Container fluid style={{ width: "95%" }}>
        <Row>
          <h1 style={{ textAlign: "center", marginTop: "1rem" }}>Students Management</h1>
        </Row>
        <Row
          style={{
            justifyContent: "center",
            display: "flex",
            marginBottom: "3%",
          }}
        >
          <Form.Control
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: "70%", padding: "5px", fontSize: "16px" }}
            type="text"
            placeholder="Enter student name to search ..."
          />
        </Row>

        <Row>
          <Col md={3}>
            <Row>
              <h2>Subjects</h2>
            </Row>
            {renderSubjects()}
          </Col>

          <Col ms={9}>
            <Row>
              <Button
                as={Link}
                to={`/`}
                style={{ width: "12%" }}
                variant="success"
              >
                Back to Home
              </Button>
            </Row>

            <Row>
              <h2 style={{ textAlign: "center" }}>
                {StudentName
                  ? `Grade Details for ${StudentName}`
                  : "Grade Details"}
              </h2>
            </Row>

            <Row>
              <h3>Add a new grade</h3>
            </Row>
            {addGradeStudent()}
            {renderGradeStudent()}
          </Col>
          <hr style={{ color: "gray", width: "100%", border: "solid 2px" }} />
          <Row>
            <h5 style={{ textAlign: "center" }}>Copyright by: HE17xxxx</h5>
          </Row>
        </Row>
      </Container>
    </>
  );
}

export default CreateGrade;
