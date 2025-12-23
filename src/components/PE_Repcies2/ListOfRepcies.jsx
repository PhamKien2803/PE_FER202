import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ListOfRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [yourRecipesTemp, setYourRecipesTemp] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterRecipes, setFilterRecipes] = useState([]);
  const [sortRecipes, setSortRecipes] = useState("");
  const [radioValue, setRadioValue] = useState("all");
  const [selectCuisine, setSelectCuisine] = useState([]);
  const [selectCuisineLink, setSelectCuisineLink] = useState("");

  useEffect(() => {
    axios.get('/recipes')
      .then((response) => setRecipes(response.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const filterSearch = recipes.filter((rep) => {
      let matchesSearch = true;
      let matchesSort = true;
      let matchesCheckBox = true;
      let mathcesRadio = true;
      let matchesLink = true;
      if (searchValue) {
        matchesSearch = String(rep?.tags).toLowerCase().includes(searchValue.toLowerCase());
      }
      if (selectCuisine.length) {
        matchesCheckBox = selectCuisine.includes(rep?.cuisine);
      }

      // if (radioValue === "Easy") {
      //   mathcesRadio = rep?.difficulty === "Easy";
      // } else if (radioValue === "Medium") {
      //   mathcesRadio = rep?.difficulty === "Medium";
      // } else if (radioValue === "all") {
      //   mathcesRadio = true;
      // }
      if (radioValue === "all" || radioValue === rep?.difficulty) {
        mathcesRadio = true;
      } else {
        mathcesRadio = false;
      }

      if (selectCuisineLink && selectCuisineLink.length !== 0) {
        matchesLink = rep?.cuisine === selectCuisineLink;
      } else {
        matchesLink = true;
      }



      return matchesSearch && matchesSort && matchesCheckBox && mathcesRadio && matchesLink;
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
    setFilterRecipes(sortedRecipes);
  }, [recipes, searchValue, sortRecipes, selectCuisine, radioValue, selectCuisineLink]);



  const handleSelectCuisine = (cuisine) => {
    setSelectCuisine((prevCuisine) => {
      return prevCuisine?.includes(cuisine)
        ? prevCuisine?.filter((cui) => cui !== cuisine)
        : [...prevCuisine, cuisine];
    })
  }

  // const handleAddToYourRecipes = (recipe) => {
  //   // Thêm recipe vào danh sách tạm thời, thêm toàn bộ
  //   setYourRecipesTemp((prev) => [...prev, recipe]);
  // };

  const handleAddToYourRecipes = (recipe) => {
    const filteredRecipe = {
      id: recipe?.id,
      name: recipe?.name,
      tags: recipe?.tags,
      ingredients: recipe?.ingredients,
      rating: recipe?.rating,
    };

    setYourRecipesTemp((prev) => [...prev, filteredRecipe]);
  };

  const handleSaveYourRecipes = async () => {
    try {
      const response = await axios.post('/your_recipes', {
        id: String(Math.floor(Math.random() * 1000)),
        recipes: yourRecipesTemp,
      });
      if (response.status === 201) {
        alert("Recipes saved successfully!");
        setYourRecipesTemp([]);
      }
    } catch (error) {
      console.error("Error saving recipes:", error);
    }
  };

  const handleRemoveRecipes = (recipeId) => {
    const filteredRecipes = yourRecipesTemp.filter((recipe) => recipe.id !== recipeId);
    setYourRecipesTemp(filteredRecipes);
  };


  const renderRecipesData = () => {
    return (
      <Table striped hover bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Tags</th>
            <th>Ingredients</th>
            <th>Rating</th>
            <th>Function</th>
          </tr>
        </thead>
        <tbody>
          {filterRecipes.map((rep) => (
            <tr key={rep?.id}>
              <td>{rep?.id}</td>
              <td>{rep?.name}</td>
              <td>{rep?.tags}</td>
              <td>{rep?.ingredients}</td>
              <td>{rep?.rating}</td>
              <td>
                <Button size="sm" variant='warning' onClick={() => handleAddToYourRecipes(rep)}>
                  Add Your Recipes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const renderYourRecipesTemp = () => {
    return (
      <Table striped hover bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Tags</th>
            <th>Ingredients</th>
            <th>Rating</th>
            <th>Function</th>
          </tr>
        </thead>
        <tbody>
          {yourRecipesTemp.map((recipe) => (
            <tr key={recipe?.id}>
              <td>{recipe?.id}</td>
              <td>{recipe?.name}</td>
              <td style={{
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}>{recipe?.tags}</td>
              <td>{recipe?.ingredients}</td>
              <td>{recipe?.rating}</td>
              <td>
                <Button variant='danger' onClick={() => handleRemoveRecipes(recipe?.id)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table >
    );
  };

  const renderCheckBoxByCuisine = () => {
    return [...new Set(recipes?.flatMap((rep) => rep?.cuisine))]?.map((cuisine) => (
      <Form.Check
        key={cuisine}
        type='checkbox'
        label={cuisine}
        onChange={() => handleSelectCuisine(cuisine)}
      >
      </Form.Check>
    ))
  }

  const renderRadioDifficuly = () => {
    const flatdifficulty = [...new Set(recipes?.map((rep) => rep?.difficulty))];

    return (
      <Form.Group>
        <Form.Check
          key={0}
          label="All"
          type="radio"
          value="all"
          onChange={(e) => setRadioValue(e.target.value)}
          checked={radioValue === "all"}
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
  }

  const renderLinkCuisine = () => {
    return [...new Set(recipes?.flatMap((rep) => rep?.cuisine))]?.map((cuisine) => (
      <Link style={{ fontSize: "16px" }} onClick={() => setSelectCuisineLink(cuisine)} to={`/recipes?cuisine-id=${cuisine}`} key={cuisine}>
        {cuisine}
      </Link>
    ))
  }

  const showAllRecipes = () => {
    setSelectCuisine([]);
    setRadioValue("all");
    setSelectCuisineLink("");
    setSearchValue("");
    setFilterRecipes(recipes);
  };


  return (
    <>
      <h1 style={{ textAlign: "center" }}>Recipes Management</h1>
      <Container fluid style={{ width: "95%" }}>
        <Row style={{ display: "inline-block", justifyContent: "center", marginTop: "1rem" }}>
          {renderLinkCuisine()}
        </Row>
        <Row style={{ marginTop: "2rem" }}>
          <input
            type='text'
            placeholder='Enter Tag to search...'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='form-control'
          />
        </Row>

        <Row>
          <Col style={{ marginTop: "3rem" }} md={8}>
            <Row>
              <Col md={6}>
                <Link onClick={showAllRecipes} to="#">
                  Show all recipes
                </Link>
              </Col>
              <Col md={6}>
                <span style={{ display: "flex", justifyContent: "flex-end" }}>
                  Sort By Rating: &nbsp;
                  <select value={sortRecipes} onChange={(e) => setSortRecipes(e.target.value)}>
                    <option value="">--- Select Sort ---</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </span>
              </Col>

            </Row>
            <Row style={{ marginTop: "1rem" }}>
              {renderRecipesData()}
            </Row>
          </Col>

          <Col style={{ marginTop: "3rem" }} md={4}>
            <h2 className='text-center'>Your Recipes: </h2>
            {yourRecipesTemp.length > 0 ? (
              <div>
                {renderYourRecipesTemp()}
                <Button style={{ marginTop: "2rem" }} variant='success' onClick={handleSaveYourRecipes}>
                  Save
                </Button>
              </div>
            ) : (
              <p style={{ textAlign: "center" }}>(Recipes is Empty)</p>
            )}
            <hr style={{ border: "2px dotted black" }} />
            <h2>Filter By Cuisine</h2>
            {renderCheckBoxByCuisine()}
            <hr style={{ border: "2px dotted black" }} />
            <h2>Filter By Difficulty</h2>
            {renderRadioDifficuly()}
          </Col>
        </Row>

      </Container>
    </>
  );
}

export default ListOfRecipes;
