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

    default:
      return state;
  }
}
