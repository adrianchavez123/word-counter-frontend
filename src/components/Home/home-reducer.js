import actions from "./home-actions";
export default function reducer(state, action) {
  switch (action.type) {
    case actions.getLastDelivers:
      return {
        ...state,
        lastDelivers: [...action.payload.lastDelivers],
      };

    case actions.getDelivers:
      return {
        ...state,
        delivers: [...action.payload.delivers],
      };

    case actions.getAverageDeliverResults:
      return {
        ...state,
        averageDeliverResults: [...action.payload.averageDeliverResults],
      };
    default:
      return state;
  }
}
