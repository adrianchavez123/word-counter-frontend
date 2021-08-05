import actions from "./assignment-actions";
export default function reducer(state, action) {
  switch (action.type) {
    case actions.openAssignmentModal:
      return { ...state, openAssignment: action.payload.openAssignment };
    case actions.setAssignment:
      return {
        ...state,
        assignment: { ...state.assignment, ...action.payload.assignment },
      };

    case actions.setGroup:
      return {
        ...state,
        assignment: { ...state.assignment, group: { ...action.payload.group } },
      };

    case actions.setDueDate:
      return {
        ...state,
        assignment: {
          ...state.assignment,
          dueDate: action.payload.dueDate,
        },
      };
    case actions.setExercise:
      return {
        ...state,
        assignment: {
          ...state.assignment,
          exercise: { ...action.payload.exercise },
        },
      };

    case actions.setAssignments:
      return {
        ...state,
        assignments: [...action.payload.assignments],
      };

    case actions.openGroupModal:
      return { ...state, openGroup: action.payload.openGroup };

    case actions.setGroups:
      return {
        ...state,
        groups: [...action.payload.groups],
      };

    case actions.setExercises:
      return {
        ...state,
        exercises: [...action.payload.exercises],
      };

    case actions.setGroupSelected:
      return {
        ...state,
        groupSelected: {
          ...state.groupSelected,
          ...action.payload.groupSelected,
        },
      };

    case actions.openExerciseModal:
      return { ...state, openExercise: action.payload.openExercise };

    case actions.setExerciseSelected:
      return {
        ...state,
        exerciseSelected: {
          ...state.exerciseSelected,
          ...action.payload.exerciseSelected,
        },
      };

    default:
      return state;
  }
}
