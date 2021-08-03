import actions from "./student-actions";
export default function reducer(state, action) {
  switch (action.type) {
    case actions.setStudents:
      return {
        ...state,
        students: [...action.payload.students],
      };
    case actions.setStudentsSelected:
      return {
        ...state,
        studentsSelected: [...action.payload.studentsSelected],
      };
    case actions.getStudentsDelivers:
      return {
        ...state,
        studentsDelivers: [...action.payload.studentsDelivers],
      };
    case actions.showDelivers:
      return {
        ...state,
        showDelivers: action.payload.showDelivers,
      };
    default:
      return state;
  }
}
