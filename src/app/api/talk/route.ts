export async function POST(req: Request) {
  const body = await req.json();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestBody = JSON.stringify(body);
  const requestHeaders = new Headers({ 'Content-Type': 'application/json' });

  const apiKey = process.env.AZURE_TALK_KEY;
  if (!apiKey) {
    throw new Error('A key should be provided to invoke the endpoint');
  }
  requestHeaders.append('Authorization', 'Bearer ' + apiKey);

  const deploy = process.env.AZURE_TALK_DEPLOYMENT;
  requestHeaders.append('azureml-model-deployment', deploy as string);
  const url = process.env.AZURE_TALK_ENDPOINT;
  const response = await fetch(url as string, {
    method: 'POST',
    body: requestBody,
    headers: requestHeaders,
  });
  try {
    if (response.ok) {
      const data = await response.json();
      return Response.json(data);
    } else {
      throw new Error('Request failed with status code ' + response.status);
    }
  } catch (error) {
    console.error(error);
    return new Response('Error generating response', { status: 500 });
  }
}
