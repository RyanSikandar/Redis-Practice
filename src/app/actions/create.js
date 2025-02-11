'use server'

import { connectRedis } from '@/lib/db'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

export async function createBook(formData) {
  const client = await connectRedis();
  const { title, rating, author, blurb } = Object.fromEntries(formData)

  const id = Math.floor(Math.random() * 100000)

  //Add the books to the sorted set (NX prevents duplicates)
  const unique = await client.zAdd('books', {
    value: title,
    score: id
  }, { NX: true })

  if (!unique) {
    return { error: 'This book already exists' }
  }
  //create a hash
  const body = {
    title,
    rating,
    author,
    blurb
  }
  await client.hSet(`book:${id}`, body)
  revalidatePath('/')

  return { success: true, redirectTo: '/' }
}