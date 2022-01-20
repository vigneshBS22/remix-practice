import { Link, redirect, useLoaderData } from 'remix';
import { db } from '~/utils/db.server';

export const loader = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) throw new Error('Joke not found');
  const data = { joke };
  return data;
};

export const action = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get('_method') === 'delete') {
    const joke = await db.joke.findUnique({
      where: { id: params.jokeId },
    });

    if (!joke) throw new Error('Joke not found');

    await db.joke.delete({ where: { id: params.jokeId } });

    return redirect('/jokes');
  }
};

export default function JokeRoute() {
  const data = useLoaderData();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to='.'>{data.joke.name} Permalink</Link>
      <div>
        <form method='POST'>
          <input type='hidden' name='_method' value='delete'></input>
          <button className='button contain'>Delete Joke</button>
        </form>
      </div>
    </div>
  );
}
