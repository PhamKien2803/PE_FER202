import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookList from "./components/PE_SUM_25_PaperNo1/BookList";
// import StudentList from "./components/PE_SUM_24BL5_StudentList/StudentList";
// import CreateGrade from './components/PE_SUM_24BL5_StudentList/CreateGrade';



function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route exact={true} path="/books" element={<BookList />} />
        {/* <Route exact={true} path="/student" element={<StudentList />} />
        <Route exact={true} path="/student/:studentid" element={<CreateGrade />} /> */}


        {/* Fall24_PaperNo1 */}
        {/* <Route exact={true} path="/" element={<ListProduct />} />
        <Route exact={true} path="/product/:id" element={<ViewDetails />} />
        <Route exact={true} path="/product/add" element={<CreateProduct />} /> */}

        {/* Fall24_PaperNo2 */}
        {/* <Route exact={true} path="/" element={<MovieList />} />
        <Route exact={true} path="/movies/:id" element={<MovieDetails />} />
         <Route exact={true} path="/movies/create" element={<CreateMovie />} /> */}

        {/* Summer24 */}
        {/* <Route exact={true} path="/movie" element={<MovieList />} />
        <Route exact={true} path="/movie-manage" element={<MovieManage />} />
        <Route exact={true} path="/movie/:id/add-stars" element={<AddStar />} /> */}

        {/* Sample_PE
        <Route exact={true} path="/" element={<TodoList />}

        {/* Summer24_BL5 */}
        {/* <Route exact={true} path="/" element={<StudentList />} />
        <Route exact={true} path="/student" element={<StudentList />} />
        <Route exact={true} path="/student/:studentid" element={<CreateGrade />} /> */}

        {/* Spring24 */}
        {/* <Route exact={true} path="/" element={<ListofProject />} />
        <Route exact={true} path="/departments/:id/employees" element={<ListEmployees />} />
        <Route exact={true} path="/projects/edit/:id" element={<EditProject />} /> */}

        {/* Spring24_BL5 */}
        {/* <Route exact={true} path="/" element={<ListOfProduct />} />
        <Route exact={true} path="/product/:id" element={<ProductDetails />} />
        <Route exact={true} path="/cart" element={<ShoppingCart />} /> */}

        {/* PE_Practice */}
        {/* <Route exact={true} path="/" element={<ListOfRepcies />} />
        <Route exact={true} path="/create-recipe" element={<CreateRepcies />} /> */}

        {/* PE_SUM24_Remove */}
        {/* <Route exact={true} path="/movie" element={<MovieList />} /> */}

        {/* PE_FALL_23_MovieManage */}
        {/* <Route exact={true} path="/" element={<CreateStar />} />
        <Route exact={true} path="/star" element={<CreateStar />} />
        <Route exact={true} path="/movie" element={<MovieManage />} />
        <Route exact={true} path="/directors" element={<Directtors />} />
        <Route exact={true} path="/producers" element={<Producers />} />
        <Route exact={true} path="/genres" element={<Genres />} /> */}

        {/* PE_Repcies2 */}
        {/* <Route exact={true} path="/" element={<ListOfRepcies />} /> */}
        {/* <Route exact={true} path="/recipes" element={<ListOfRepcies />} /> */}
        {/* <Route exact={true} path="/" element={<TodoList />} /> */}

        {/* PE_FALL24_BL5 */}
        {/* <Route exact={true} path="/" element={<ProductList />} /> */}

        {/* PE_SPRING_25_ShoppingSystem */}
        {/* <Route exact={true} path="/" element={<OrderProduct />} />
        <Route exact={true} path="/orders" element={<OrderDetails />} /> */}

        {/* PE_SPRING_25_ProductViewCard */}
        {/* <Route exact={true} path="/" element={<ProductReview />} />
        <Route exact={true} path="/reviews" element={<ListOfReview />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
