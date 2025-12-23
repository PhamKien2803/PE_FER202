import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
function CreateRecipes() {
    const [users, setUsers] = useState([]);
    // State để quản lý dữ liệu form
    const [formData, setFormData] = useState({
        name: '',
        ingredients: '',
        instructions: [''],
        prepTimeMinutes: '',
        cookTimeMinutes: '',
        servings: '',
        difficulty: 'Easy',
        cuisine: '',
        caloriesPerServing: '',
        tags: [''],
        userId: '',
        image: '',
        rating: '',
        reviewCount: '',
        mealType: [''],
    });

    useEffect(() => {
        axios.get('/users')
            .then((response) => setUsers(response.data))
            .catch((err) => console.log(err));
    }, []);

    // Xử lý khi thay đổi dữ liệu form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Xử lý thêm chỉ dẫn vì nó là mảng
    const handleInstructionChange = (index, value) => {
        const updatedInstructions = [...formData.instructions];
        updatedInstructions[index] = value;
        setFormData({
            ...formData,
            instructions: updatedInstructions,
        });
    };

    // Thêm một chỉ dẫn mới
    const addInstruction = () => {
        setFormData({
            ...formData,
            instructions: [...formData.instructions, ''],
        });
    };

    // Tags
    const handleTagsChange = (index, value) => {
        const updatedTags = [...formData.tags];
        updatedTags[index] = value;
        setFormData({
            ...formData,
            tags: updatedTags,
        });
    };

    const addTag = () => {
        setFormData({
            ...formData,
            tags: [...formData.tags, ''],
        });
    };

    //MealType
    const handleMealTypeChange = (index, value) => {
        const updatedMealType = [...formData.mealType];
        updatedMealType[index] = value;
        setFormData({
            ...formData,
            mealType: updatedMealType,
        });
    }

    const addMealType = () => {
        setFormData({
            ...formData,
            mealType: [...formData.mealType, ''],
        });
    }


    //Hàm Create Recipe
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const request = await axios.post('/recipes', formData);
            if (request.status === 201) {
                alert('Recipe created successfully');
                window.location.href = '/';
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container className="my-5">
            <Button variant='primary' as={Link} to='/'>Back To Home</Button>
            <h1 className="text-center mb-4">Create New Recipes</h1>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Recipe Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter recipe name"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Cuisine</Form.Label>
                            <Form.Control
                                type="text"
                                name="cuisine"
                                value={formData.cuisine}
                                onChange={handleChange}
                                placeholder="e.g., Italian, Chinese"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Preparation Time (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                name="prepTimeMinutes"
                                value={formData.prepTimeMinutes}
                                onChange={handleChange}
                                placeholder="e.g., 20"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Cooking Time (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                name="cookTimeMinutes"
                                value={formData.cookTimeMinutes}
                                onChange={handleChange}
                                placeholder="e.g., 15"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Servings</Form.Label>
                            <Form.Control
                                type="number"
                                name="servings"
                                value={formData.servings}
                                onChange={handleChange}
                                placeholder="Number of servings"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Difficulty</Form.Label>
                            <Form.Select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Ingredients</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        placeholder="List ingredients here..."
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Instructions</Form.Label>
                    {formData.instructions.map((instruction, index) => (
                        <div key={index} className="mb-2">
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={instruction}
                                onChange={(e) => handleInstructionChange(index, e.target.value)}
                                placeholder={`Step ${index + 1}`}
                            />
                        </div>
                    ))}
                    <Button variant="outline-primary" onClick={addInstruction}>
                        Add Step
                    </Button>
                </Form.Group>

                <Row className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Calories Per Serving</Form.Label>
                            <Form.Control
                                type="number"
                                name="caloriesPerServing"
                                value={formData.caloriesPerServing}
                                onChange={handleChange}
                                placeholder="Calories per serving"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Tags (comma-separated)</Form.Label>
                            {formData.tags.map((tag, index) => (
                                <div key={index} className="mb-2">
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={tag}
                                        onChange={(e) => handleTagsChange(index, e.target.value)}
                                        placeholder={`Tags ${index + 1}`}
                                    />
                                </div>
                            ))}
                            <Button variant="outline-primary" onClick={addTag}>
                                Add Tags
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Paste an image URL"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        placeholder='Rating'
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Review Count</Form.Label>
                    <Form.Control
                        type="number"
                        name="reviewCount"
                        value={formData.reviewCount}
                        onChange={handleChange}
                        placeholder='Review Count'
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Meal Types</Form.Label>
                    {formData.mealType.map((meal, index) => (
                        <div key={index} className="mb-2">
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={meal}
                                onChange={(e) => handleMealTypeChange(index, e.target.value)}
                                placeholder={`Meal Type ${index + 1}`}
                            />
                        </div>
                    ))}
                    <Button variant="outline-primary" onClick={addMealType}>
                        Add MealType
                    </Button>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>User ID</Form.Label>
                    <Form.Select
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select User</option>
                        {users?.map((user) => (
                            <option key={user?.id} value={user?.id}>
                                {user?.id} - {user?.firstName} {user?.lastName}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create Recipes
                </Button>
            </Form>
        </Container>
    );
}

export default CreateRecipes;
