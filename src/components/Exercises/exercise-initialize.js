const initialState = {
  openExercise: false,
  exercise: {
    title: "",
    description: "",
    wordsAmount: 0,
    exercise_id: null,
    exercise_image: "",
  },
  exercises: [],
  action: "CREATE",
  imageSrc: "",
};

export default initialState;
