import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SubjectsPage from "./pages/SubjectPage";
import KidFriendlyPage from "./pages/KidFriendlyPage";
// import QuizPage from "./pages/QuizPage";
import MathTopicsList from "./pages/MathTopicList";
import SortingComponent from "./pages/SortingComponent";
import DragSortBuckets from "./pages/DragSortBuckets";
import QuizPage from "./componentss/QuizPage";
import LessonList from "./componentss/LessonList";
import IXLHomePage from "./componentss/IXLHomePage";
import SSC_CHSL_MockTest from "./componentss/SSC_CHSL_MockTest";
import Vijay from "./componentss/Vijay";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/kid/:topicKey" element={<QuizPage />} /> */}
      {/* <Route path="/quiz/:subject/:skill" element={<QuizPage />} /> */}

      {/* <Route path="/kid-math" element={<MathTopicsList />} /> */}
      <Route path="/bucket" element={<DragSortBuckets />} />
      <Route path="/vijay" element={<Vijay />} />
      <Route path="/ixl-home" element={<IXLHomePage />} />
      <Route path="/lessons" element={<LessonList />} />
      <Route path="/sorting" element={<SortingComponent />} />
      <Route path="/ssc" element={<SSC_CHSL_MockTest />} />
      <Route path="/kid-math" element={<MathTopicsList />} />
      <Route path="/quiz/:topicId" element={<QuizPage />} />

      <Route path="/kid/:topicId" element={<KidFriendlyPage />} />
      <Route path="/subjects/:classId" element={<SubjectsPage />} />

      <Route
        path="/*"
        element={
          <IXLHomePage />
        }
      />
    </Routes>
  );
}
export default App;

// https://vxl-0sy3.onrender.com/subjects/67f1096ed52c89d85988eb4a
