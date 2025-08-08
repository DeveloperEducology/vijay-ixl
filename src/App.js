import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SubjectsPage from "./pages/SubjectPage";
import KidFriendlyPage from "./pages/KidFriendlyPage";
import QuizPage from "./pages/QuizPage";
import MathTopicsList from "./pages/MathTopicList";
import SortingComponent from "./pages/SortingComponent";
import DragSortBuckets from "./pages/DragSortBuckets";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/kid/:topicKey" element={<QuizPage />} /> */}
      <Route path="/quiz/:subject/:skill" element={<QuizPage />} />

      {/* <Route path="/kid-math" element={<MathTopicsList />} /> */}
      <Route path="/bucket" element={<DragSortBuckets />} />
      <Route path="/sorting" element={<SortingComponent />} />
      <Route path="/kid-math" element={<MathTopicsList />} />

      <Route path="/kid/:topicId" element={<KidFriendlyPage />} />
      <Route path="/subjects/:classId" element={<SubjectsPage />} />

      <Route
        path="/*"
        element={
          <div className="flex justify-center">Not found any Page404</div>
        }
      />
    </Routes>
  );
}
export default App;

// https://vxl-0sy3.onrender.com/subjects/67f1096ed52c89d85988eb4a
