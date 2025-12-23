import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

function ListEmployees() {
  const { id } = useParams();
  const [employee, setEmployee] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios.get('/departments')
      .then((response) => setDepartments(response.data))
      .catch((err) => console.log(err));

    axios.get(`/employees?department=${id}`)
      .then((response) => setEmployee(response.data))
      .catch((err) => console.log(err));
  }, [id]);


  return (
    <>
      <Link to={"/"}>Home Page</Link>
      <h4>Department: {departments?.find((dep) => dep?.id === id)?.name}</h4>
      {employee.length ? (
        <Table striped>
          <thead>
            <tr>
              <th>Id</th>
              <th>Employees Name</th>
              <th>Date of birth</th>
              <th>Gender</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((em) => {
              return (
                <tr key={em?.id}>
                  <td>{em?.id}</td>
                  <td>{em?.name}</td>
                  <td>{em?.dob}</td>
                  <td>{em?.gender}</td>
                  <td>{em?.position}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : null}
    </>
  )
}

export default ListEmployees
