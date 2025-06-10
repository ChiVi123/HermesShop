const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await sleep(1000);
  return Response.json({ message: 'hello world' });
}
