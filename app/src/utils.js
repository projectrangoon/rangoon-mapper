export function createConstants(...constants) {
  return constants.reduce((acc, constant) => {
    return Object.assign({}, acc, {
      [constant]: constant
    })
  }, {});
}

export const isEnglish = /^[A-Za-z0-9]*$/;


export const distance = (λ1,φ1,λ2,φ2) => {
  // lon1, lat1, lon2, lat2
    var R = 6371000;
    var Δλ = (λ2 - λ1) * Math.PI / 180;
    φ1 = φ1 * Math.PI / 180;
    φ2 = φ2 * Math.PI / 180;
    var x = Δλ * Math.cos((φ1+φ2)/2);
    var y = (φ2-φ1);
    var d = Math.sqrt(x*x + y*y);
    return R * d;
};