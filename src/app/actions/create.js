'use server'

import { connectRedis } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function createBook(formData) {
  const client = await connectRedis();
  const { title, rating, author, blurb } = Object.fromEntries(formData)

  const id = Math.floor(Math.random() * 1000)
  const body = {
    title,
    rating,
    author,
    blurb
  }
  await client.hSet(`book:${id}`, body)
}