export const updateObject = (prevState, nextState) => {
    return {
        ...prevState,
        ...nextState,
   }
}