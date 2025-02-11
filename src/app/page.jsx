import { connectRedis } from '@/lib/db'
import Link from 'next/link'

const getBooks = async () => {
  const client = await connectRedis();
  //Figuring out the keys for the hashes
  const result = await client.zRangeWithScores('books', 0, -1)
  //[{value: 'title', score: id}]

  //Pipelines in redis
  const books = Promise.all(
    result.map((book) => {
      return client.hGetAll(`book:${book.score}`)
    })
  )

  return books
}

export default async function Home() {
  const books = await getBooks()
  return (
    <main>
      <nav className="flex justify-between">
        <h1 className='font-bold'>Books on Redis!</h1>
        <Link href="/create" className="btn">Add a new book</Link>
      </nav>

      <p>List of books here.</p>
      <ul>
        {books.map((book) => (
          <div key={book.title} className='card'>
            <h2>{book.title}</h2>
            <p>Author: {book.author}</p>
            <p>Rating: {book.rating}</p>
            <p>Blurb: {book.blurb}</p>
          </div>
        ))}
      </ul>
    </main>
  )
}
