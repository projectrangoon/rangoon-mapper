export function createConstants(...constants) {
  return constants.reduce((acc, constant) => {
    return Object.assign({}, acc, {
      [constant]: constant
    })
  }, {});
}

export const isEnglish = /^[A-Za-z0-9]*$/;
