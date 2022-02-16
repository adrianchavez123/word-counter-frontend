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

    case actions.setContent:
      return {
        ...state,
        exercise: {
          ...state.exercise,
          content: action.payload.content,
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

    case actions.setQuestionName: {
      const questionIndex = state.exercise.questions.findIndex(
        (question) => question.questionId === action.payload.questionId
      );

      if (questionIndex > -1) {
        const questionsUpdated = [...state.exercise.questions];
        questionsUpdated[questionIndex].questionName =
          action.payload.questionName;
        return {
          ...state,
          exercise: {
            ...state.exercise,
            questions: [...questionsUpdated],
          },
        };
      }
      return state;
    }
    case actions.addQuestion:
      const emptyNewQuestion = {
        questionId: state.exercise.questions.length,
        questionName: "",
        options: [
          { optionName: "", correctAnswer: false },
          { optionName: "", correctAnswer: false },
          { optionName: "", correctAnswer: false },
          { optionName: "", correctAnswer: false },
        ],
      };
      return {
        ...state,
        exercise: {
          ...state.exercise,
          questions: [...state.exercise.questions, emptyNewQuestion],
        },
      };

    case actions.deleteQuestion: {
      const questionIndex = state.exercise.questions.findIndex(
        (question) => question.questionId === action.payload.questionId
      );

      if (questionIndex > -1) {
        const questionsUpdated = [...state.exercise.questions];
        questionsUpdated.splice(questionIndex, 1);

        return {
          ...state,
          exercise: {
            ...state.exercise,
            questions: questionsUpdated,
          },
        };
      }
      return state;
    }

    case actions.setOptionName: {
      const questionIndex = state.exercise.questions.findIndex(
        (question) => question.questionId === action.payload.questionId
      );

      if (questionIndex > -1) {
        const questionsUpdated = [...state.exercise.questions];
        questionsUpdated[questionIndex].options[
          action.payload.optionPosition
        ].optionName = action.payload.optionName;
        return {
          ...state,
          exercise: {
            ...state.exercise,
            questions: questionsUpdated,
          },
        };
      }
      return state;
    }

    case actions.setCorrectResponse: {
      const questionIndex = state.exercise.questions.findIndex(
        (question) => question.questionId === action.payload.questionId
      );

      if (questionIndex > -1) {
        const questionsUpdated = [...state.exercise.questions];
        questionsUpdated[questionIndex].options = questionsUpdated[
          questionIndex
        ].options.map((option, i) => {
          if (i === action.payload.optionPosition) {
            option.correctAnswer = true;
          } else {
            option.correctAnswer = false;
          }
          return option;
        });
        return {
          ...state,
          exercise: {
            ...state.exercise,
            questions: questionsUpdated,
          },
        };
      }
      return state;
    }

    case actions.deleteOption: {
      const questionIndex = state.exercise.questions.findIndex(
        (question) => question.questionId === action.payload.questionId
      );

      if (questionIndex > -1) {
        const questionsUpdated = [...state.exercise.questions];
        questionsUpdated[questionIndex].options.splice(
          action.payload.optionPosition,
          1
        );
        return {
          ...state,
          exercise: {
            ...state.exercise,
            questions: questionsUpdated,
          },
        };
      }
      return state;
    }

    case actions.addOption: {
      const questionIndex = state.exercise.questions.findIndex(
        (question) => question.questionId === action.payload.questionId
      );
      if (questionIndex > -1) {
        const questionsUpdated = [...state.exercise.questions];

        questionsUpdated[questionIndex].options.push({
          optionName: "",
          correctAnswer: false,
        });
        return {
          ...state,
          exercise: {
            ...state.exercise,
            questions: questionsUpdated,
          },
        };
      }
      return state;
    }
    default:
      return state;
  }
}
