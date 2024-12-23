const B = 2;
const M = 19;
// const S = Math.floor(Math.random() * 1000);
const S = 15;

export const exchangeAB = (clientStep1) => {
    const step1 = Math.pow(B, S) % M;
    const step2 = Math.pow(clientStep1, S) % M;
    console.log('step2', step2);
    return step1;
}