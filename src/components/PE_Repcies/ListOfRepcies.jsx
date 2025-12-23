import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ListOfRepcies() {
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterRecipes, setfilterRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [sortRecipes, setSortRecipes] = useState("");

  const [radioValue, setRadioValue] = useState(0);
  const [selectedCuisine, setSelectedCuisine] = useState([]);

  useEffect(() => {

    axios.get('/recipes')
      .then((response) => setRecipes(response.data))
      .catch((err) => console.log(err));

    axios.get('/users')
      .then((response) => setUsers(response.data))
      .catch((err) => console.log(err));

  }, []);

  useEffect(() => {
    const filterSearch = recipes.filter((rep) => {
      let matchesSearch = true;
      let matchesSort = true;
      let matchesRadio = true;
      let matchesCheckBox = true;
      let matchesSelectUser = true;
      //Search by tags
      // do tags là mảng nên phải chuyển về chuỗi để so sánh
      if (searchValue) {
        matchesSearch = String(rep?.tags).toLowerCase().includes(searchValue.toLowerCase());
      }

      //Filter by difficulty (Radio Button)
      //Nếu mà trong data chữ nó là chữ thường thì khi so sánh phải toLowerCase nó về giống nhau mới so sánh được
      //Còn nếu đã là chữ hoa thì không cần phải toLowerCase, viết thẳng luôn
      if (radioValue === "Easy") {
        matchesRadio = rep?.difficulty === "Easy";
      } else if (radioValue === "Medium") {
        matchesRadio = rep?.difficulty === "Medium";
      } else if (radioValue === "all") {
        matchesRadio = true;
      }

      //Filter by cuisine (Checkbox)
      // if (selectedCuisine.length && !selectedCuisine.includes(rep?.cuisine)) {
      //   matchesCheckBox = false;
      // }
      if (selectedCuisine.length) {
        matchesCheckBox = selectedCuisine.includes(rep?.cuisine)
      }

      //Filter by UserName (Select)
      // if(selectedUser && selectedUser !== String(rep?.userId)) {
      //   matchesSelectUser = false;
      // }
      if (selectedUser) {
        matchesSelectUser = String(rep?.userId) === selectedUser
      }
      return matchesSearch && matchesSort && matchesRadio && matchesCheckBox && matchesSelectUser;
    });

    //Sort by Rating
    const sortedRecipes = [...filterSearch].sort((a, b) => {
      if (sortRecipes === "asc") {
        return a?.rating - b?.rating;
      } else if (sortRecipes === "desc") {
        return b?.rating - a?.rating;
      }
      return 0;
    });
    setfilterRecipes(sortedRecipes);
  }, [recipes, searchValue, sortRecipes, radioValue, selectedCuisine, selectedUser]);


  const handleSelectCuisine = (cuisine) => {
    setSelectedCuisine((prevCuisine) => {
      return prevCuisine.includes(cuisine) ?
        prevCuisine.filter((c) => c !== cuisine) :
        [...prevCuisine, cuisine];
    })
  }

  const handleViewRecipe = (id) => {
    const recipe = recipes.find((rep) => rep?.id === id);
    setSelectedRecipe(recipe);
  };

  const renderRecipesData = () => {
    return (
      <Table striped hover bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Tags</th>
            <th>UserName</th>
            <th>Ingredients</th>
            <th>Rating</th>
            <th>Function</th>
          </tr>
        </thead>
        <tbody>
          {filterRecipes.map((rep) => (
            <tr key={rep?.id}>
              <td>{rep?.id}</td>
              <td style={{ width: "50%" }}>{rep?.name}</td>
              <td>{rep?.tags}</td>
              <td>
                {
                  users?.find((user) => String(user?.id) === String(rep?.userId))?.firstName + " " +
                  users?.find((user) => String(user?.id) === String(rep?.userId))?.lastName
                }
              </td>

              <td>{rep?.ingredients}</td>
              <td>{rep?.rating}</td>
              <td>
                <Button as={Link} to={`/create-recipe`} style={{ marginBottom: "1rem" }} variant='info'>Create</Button>
                <Button style={{ width: "100%", marginBottom: "1rem" }} variant='success' onClick={() => handleViewRecipe(rep?.id)}>View</Button>
                <Button variant='danger' onClick={() => handleDelete(rep?.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const renderUsersData = () => {
    return (
      <span>
        Filter By UserName: &nbsp;
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">--- Select UserName ---</option>
          {users?.map((use) => (
            <option key={use?.id} value={use?.id}> {use?.firstName + " " + use?.lastName}</option>
          ))}
        </select>
      </span>
    )
  }

  const renderSortRecipes = () => {
    return (
      <span style={{ display: "flex", justifyContent: "flex-end" }}>
        Sort By Rating: &nbsp;
        <select value={sortRecipes} onChange={(e) => setSortRecipes(e.target.value)}>
          <option value="">--- Select Sort ---</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </span>
    )
  }

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setSelectedRecipe((preRecipe) => ({
      ...preRecipe,
      [name]: value
    }));
  }

  //Update Recipe
  const handleUpdate = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      if (!selectedRecipe?.ingredients) {
        alert("Please enter the form fields that are required.");
        return;
      }
      const request = await axios.put(`/recipes/${selectedRecipe?.id}`, selectedRecipe);
      if (request.status === 200) {
        alert("Recipe updated successfully");
        window.location.href = "/";
      }
    } catch (e) {
      console.error(e)
    }
  }

  //Delete Recipe
  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        const request = await axios.delete(`/recipes/${id}`);
        if (request.status === 200) {
          alert("Recipe deleted successfully");
          window.location.href = "/";
        }
      } else {
        return;
      }

    } catch (e) {
      console.error(e)
    }
  }

  const renderRadioBydifficulty1 = () => {
    return (
      <Form>
        <Form.Check
          key={1}
          label="Easy"
          name="difficulty"
          type="radio"
          value="Easy"
          onChange={(e) => setRadioValue(e.target.value)}
          checked={radioValue === "Easy"}
        />
        <Form.Check
          key={2}
          label="Medium"
          name="difficulty"
          type="radio"
          value="Medium"
          onChange={(e) => setRadioValue(e.target.value)}
          checked={radioValue === "Medium"}
        />
        <Form.Check
          key={3}
          label="All"
          name="difficulty"
          type="radio"
          value="all"
          onChange={(e) => setRadioValue(e.target.value)}
          checked={radioValue === "all"}
        />
      </Form>
    )
  }

  const renderRadioBydifficulty2 = () => {
    // Lấy danh sách độ khó duy nhất
    // Chỉ dùng flatMap khi nó là mảng trong mảng
    // Nếu không phải mảng trong mảng mà vẫn bị lặp lại thì dùng Set rồi map lại từng phần tử trong mảng đó
    const flatdifficulty = [...new Set(recipes?.map((rep) => rep?.difficulty))];

    return (
      <Form.Group>
        <Form.Check
          key={0}
          label="All"
          type="radio"
          value={0}
          onChange={(e) => setRadioValue(e.target.value)}
          checked={radioValue === 0}
        />
        {flatdifficulty?.map((difficulty) => (
          <Form.Check
            key={difficulty?.id} 
            label={difficulty}
            type="radio"
            value={difficulty}
            onChange={(e) => setRadioValue(e.target.value)}
            checked={radioValue === difficulty}
          />
        ))}
      </Form.Group>
    );
  };


  const renderCheckBoxByCuisine = () => {
    //do mảng bị lặp lại nên phải dùng Set để loại bỏ phần tử trùng lặp
    // nên phải làm phẳng mảng = flatMap
    // rồi map lại từng phần tử trong mảng đó để render ra
    return [...new Set(recipes?.flatMap((rep) => rep?.cuisine))].map((cuisine) => (
      <Form.Check style={{ marginLeft: "1rem" }}
        key={cuisine}
        type="checkbox"
        label={cuisine}
        onChange={() => handleSelectCuisine(cuisine)}
      />
    ))
  }

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Recipes Management</h1>
      <Container fluid style={{ width: "90%" }}>

        <Row style={{ marginTop: "2rem" }}>
          <input
            type='text'
            placeholder='Enter Tag to search...'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Row>

        <Row>
          <Col style={{ marginTop: "3rem" }} md={9}>
            <Row style={{ marginBottom: "1rem" }}>

              <Col md={6}>
                {renderUsersData()}
              </Col>

              <Col md={6}>
                {renderSortRecipes()}
              </Col>

            </Row>
            <Row>
              {renderRecipesData()}
            </Row>
          </Col>

          <Col style={{ marginTop: "3rem" }} md={3}>
            <h2>Ingredients List: </h2>
            {selectedRecipe ? (
              <div>
                <h3>{selectedRecipe.name}</h3>
                <p><strong>ID:</strong> {selectedRecipe?.id}</p>
                <p><strong>Name:</strong> {selectedRecipe?.name}</p>
                <h4>Add a new ingredients: </h4>
                <input name='ingredients' value={selectedRecipe?.ingredients} type='text' onChange={handleChangeValue} /> <br />
                <Button style={{ marginTop: "2rem" }} variant='warning' onClick={handleUpdate}>Update</Button>
              </div>
            ) : (
              <p>List is Empty</p>
            )}
            <hr style={{ border: "3px dashed black" }} />
            <Row>
              <h3>Filter By Difficulty</h3>
              {renderRadioBydifficulty2()}
            </Row>
            <hr style={{ border: "3px dashed black" }} />
            <Row>
              <h3>Filter By Cuisine</h3>
              {renderCheckBoxByCuisine()}
            </Row>
          </Col>
        </Row>

      </Container>
    </>
  );
}

export default ListOfRepcies;