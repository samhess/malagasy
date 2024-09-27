import db from '$lib/server/database.js'
import {json} from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
  const data = await request.json()
  await db.expressions.create({
    data
  })
  return json({})
}

export async function PUT({request}) {
  const {PartOfSpeech, id, ...data} = await request.json()
  await db.expressions.update({
    where: {id:parseInt(id)},
    data: {
      ...data,
      PartOfSpeech:{connect:{code:PartOfSpeech.value}}
    }
  })
  return json({})
}