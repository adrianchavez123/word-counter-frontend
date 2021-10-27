const initialState = {
  openAssignment: false,
  assignment: {
    assignment_id: null,
    group: { id: "", text: "" },
    dueDate: "",
    exercise: { id: "", text: "" },
  },
  assignments: [],
  groups: [],
  openGroup: false,
  exercises: [],
  groupSelected: { group_id: null, name: "", students: [] },
  openExercise: false,
  exerciseSelected: { exercise_id: null, title: "", description: "" },
  action: "CREATE",
};

export default initialState;
