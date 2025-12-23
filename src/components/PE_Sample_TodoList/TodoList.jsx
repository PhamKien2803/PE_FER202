import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'

function TodoList() {
  const [user, setUser] = useState([])
  const [todo, setTodo] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [radioValue, setRadioValue] = useState("all")
  const [filterTodo, setFilterTodo] = useState([])
  const [sortOrder, setSortOrder] = useState("asc")

  useEffect(() => {
    axios.get('/user')
      .then((response) => setUser(response.data))
      .catch((err) => console.log(err));

    axios.get('/todo')
      .then((response) => setTodo(response.data))
      .catch((err) => console.log(err));
  }, [])

  useEffect(() => {
    const filteredTodos = todo?.filter((to) => {
      if (selectedUsers.length && !selectedUsers.includes(to.userId)) {
        return false
      }
      if (radioValue === 'finished' && !to.completed) {
        return false
      }
      if (radioValue === 'unfinished' && to.completed) {
        return false
      }
      return true
    })

    setFilterTodo(filteredTodos)
  }, [todo, selectedUsers, radioValue])

  const handleChangeStatus = (id) => {
    const newTodo = [...todo] //Lấy lại data todo
    const index = newTodo.findIndex((to) => to.id === id) //Tìm vị trí của todo cần thay đổi
    newTodo[index].completed = !newTodo[index].completed //Đảo ngược trạng thái completed
    setTodo(newTodo)
  }

  const handleUserSelection = (e) => {
    const userId = parseInt(e)
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId) // bỏ chọn user
        : [...prevSelected, userId] // chọn user
    )
  }

  const handleSortTodos = () => {
    const sortedTodos = [...filterTodo].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title)
      } else {
        return b.title.localeCompare(a.title)
      }
    })
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    setFilterTodo(sortedTodos)
  }

  const renderUsers = () => {
    return (
      <Form>
        {user?.map((us) => (
          <Form.Check
            key={us?.id}
            value={us?.id}
            type="checkbox"
            label={us?.name}
            onChange={() => handleUserSelection(us?.id)}
          />
        ))}
      </Form>
    )
  }

  const renderCompleted = () => {
    return (
      <Form>
        <Form.Check
          key={1}
          label="Finished"
          name="completed"
          type="radio"
          value="finished"
          onChange={(e) => setRadioValue(e.target.value)}
          checked={radioValue === "finished"}
        />
        <Form.Check
          key={2}
          label="Unfinished"
          name="completed"
          type="radio"
          value="unfinished"
          onChange={(e) => setRadioValue(e.target.value)}
          checked={radioValue === "unfinished"}
        />
        <Form.Check
          key={3}
          label="All"
          name="completed"
          type="radio"
          value="all"
          onChange={(e) => setRadioValue(e.target.value)}
          checked={radioValue === "all"}
        />
      </Form>
    )
  }

  const renderTodoList = () => {
    return (
      <Table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Title</th>
            <th>User</th>
            <th>Completed</th>
            <th>Change status</th>
          </tr>
        </thead>
        <tbody>
          {filterTodo?.map((to, index) => (
            <tr key={to?.id}>
              <td>{index + 1}</td>
              <td>{to?.title}</td>
              <td>
                {
                  user?.find((us) => parseInt(us?.id) === parseInt(to?.userId))?.name
                }
              </td>
              <td>{to.completed ? (
                <p style={{ color: "blue" }}>Finished</p>
              ) : (
                <p style={{ color: "red" }}>Unfinished</p>
              )}</td>
              <td><Button
                variant="success"
                onClick={() => handleChangeStatus(to?.id)}
              >
                Change
              </Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }

  return (
    <>
      <Container>
        <Row>
          <Col md={8}>
            <h1 style={{ textAlign: 'center' }}>Todo List</h1>
            <span>
              Sort:
              <Button onClick={handleSortTodos} variant='primary'>
                {sortOrder === "asc" ? "Ascending by Title" : "Descending by Title"}
              </Button>
            </span>
            <hr style={{ color: "green" }} />
            {renderTodoList()}
          </Col>
          <Col md={4}>
            <h2>Users</h2>
            {renderUsers()}
            <hr style={{ color: "green" }} />
            <h2>Completed</h2>
            {renderCompleted()}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default TodoList
