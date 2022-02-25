import actions from "./deliver-review-actions";
export default function reducer(state, action) {
  switch (action.type) {
    case actions.setDeliver:
      return {
        ...state,
        ...action.payload,
      };
    case actions.setExerciseDetails:
      return {
        ...state,
        ...action.payload,
      };
    case actions.setQuizz:
      return {
        ...state,
        questions: [...action.payload.questions],
      };
    default:
      return state;
  }
}
