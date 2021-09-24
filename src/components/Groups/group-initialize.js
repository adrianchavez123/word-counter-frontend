const initialState = {
  openGroup: false,
  group: {
    name: "",
    students: [],
    token: "",
    group_id: "",
  },
  student: {
    name: "",
    id: "",
  },
  action: "MODIFY",
  groups: [],
};

export default initialState;
