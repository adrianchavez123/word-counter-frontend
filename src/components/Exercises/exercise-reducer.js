import actions from "./exercise-actions";
export default function reducer(state, action) {
  switch (action.type) {
    case actions.openExerciseModal:
      return { ...state, openExercise: action.payload.openExercise };
    case actions.setExercise:
      return { ...state, exercise: { ...action.payload.exercise } };

    case actions.setTitle:
      return {
        ...state,
        exercise: { ...state.exercise, title: action.payload.title },
      };

    case actions.setDescription:
      return {
        ...state,
        exercise: {
          ...state.exercise,
          description: action.payload.description,
        },
      };

    case actions.setWordsAmount:
      return {
        ...state,
        exercise: {
          ...state.exercise,
          wordsAmount: action.payload.wordsAmount,
        },
      };

    case actions.setExerciseImage:
      return {
        ...state,
        exercise: {
          ...state.exercise,
          exercise_image: action.payload.exercise_image,
        },
      };

    case actions.setImageSrc:
      return {
        ...state,
        imageSrc: action.payload.imageSrc,
      };

    case actions.setExercises:
      return {
        ...state,
        exercises: [...action.payload.exercises],
      };

    case actions.setAction:
      return {
        ...state,
        action: action.payload.action,
      };

    default:
      return state;
  }
}
