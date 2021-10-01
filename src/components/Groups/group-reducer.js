import actions from "./group-actions";
export default function reducer(state, action) {
  switch (action.type) {
    case actions.openGroupModal:
      return { ...state, openGroup: action.payload.openGroup };
    case actions.setGroup:
      return { ...state, group: { ...action.payload.group } };

    case actions.setName:
      return {
        ...state,
        group: { ...state.group, name: action.payload.name },
      };

    case actions.setStudentName:
      return {
        ...state,
        student: { ...state.student, name: action.payload.studentName },
      };

    case actions.setStudentId:
      return {
        ...state,
        student: { ...state.student, id: action.payload.studentId },
      };

    case actions.addStudent:
      return {
        ...state,
        group: {
          ...state.group,
          students: [...state.group.students, action.payload.student],
        },
        student: {
          name: "",
          id: "",
        },
      };

    case actions.removeStudent:
      return {
        ...state,
        group: {
          ...state.group,
          students: [
            ...state.group.students.filter((st) => st.id !== action.payload.id),
          ],
        },
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
