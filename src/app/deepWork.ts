const worker = new Worker(new URL('./deep-thought.ts', import.meta.url));
worker.onmessage = ({ data: { answer } }) => {
    console.log(answer);
};
export default worker;