export const concurrentRunner = async <Result>(tasks: Array<() => Promise<Result>>, concurrency: number): Promise<Result[]> => {
  const results: Result[] = [];
  for (let i = 0; i < Math.ceil(tasks.length / concurrency); i++) {
    const promises = tasks.slice(i * concurrency, (i + 1) * concurrency).map((task) => task());
    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults);
  }
  return results;
}
