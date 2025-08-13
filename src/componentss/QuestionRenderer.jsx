import MCQQuestion from "./MCQQuestion";
import InputQuestion from "./InputQuestion";
import FillBlankQuestion from "./FillBlankQuestion";
import DragDropQuestion from "./DragDropQuestion";

export default function QuestionRenderer({ questionData, onAnswer }) {
  switch (questionData.questionType) {
    case "mcq":
      return <MCQQuestion data={questionData} onAnswer={onAnswer} />;
    case "input":
      return <InputQuestion data={questionData} onAnswer={onAnswer} />;
    case "fill_blank":
      return <FillBlankQuestion data={questionData} onAnswer={onAnswer} />;
    case "drag_drop":
      return <DragDropQuestion data={questionData} onAnswer={onAnswer} />;
    default:
      return <div>Unsupported question type</div>;
  }
}
