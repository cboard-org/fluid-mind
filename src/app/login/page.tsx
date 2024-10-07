import Login from './Login';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<JSX.Element | unknown> {
  let errorMessage = '';
  if ('error' in searchParams && typeof searchParams['error'] == 'string') {
    errorMessage = searchParams['error'];
  }
  return <Login errorMessage={errorMessage} />;
}
