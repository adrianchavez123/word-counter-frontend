const initialState = {
  openExercise: false,
  exercise: {
    title: "",
    description: "",
    wordsAmount: 0,
    exercise_id: null,
    exercise_image: "",
    content: "",
    questions: [
      {
        questionId: 0,
        questionName: "",
        options: [
          { optionName: "", correctAnswer: false },
          { optionName: "", correctAnswer: false },
          { optionName: "", correctAnswer: false },
          { optionName: "", correctAnswer: false },
        ],
      },
    ],
  },
  exercises: [],
  action: "CREATE",
  imageSrc: "",
};

export default initialState;
