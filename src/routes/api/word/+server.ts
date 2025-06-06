import db from '$lib/server/database'
import {json} from '@sveltejs/kit'

export async function POST({request}) {
  const {Language, PartOfSpeech, Topic, ...attributes} = await request.json()
  await db.word.create({
    data: {
      ...attributes,
      Language: {connect: {code: Language.value}},
      PartOfSpeech: {connect: {code: PartOfSpeech.value}},
      Topic: Topic.value ? {connect: {key: Topic.value}} : undefined
    }
  })
  return json({})
}

export async function PUT({request}) {
  const {Language, PartOfSpeech, Topic, term, ...attributes} = await request.json()
  const partOfSpeech = PartOfSpeech.value
  const language = Language.value
  await db.word.update({
    where: {term_partOfSpeech_language: {term, partOfSpeech, language}},
    data: {
      ...attributes,
      Language: {connect: {code: Language?.value ?? 'eng'}},
      PartOfSpeech: {connect: {code: PartOfSpeech.value}},
      Topic: Topic.value ? {connect: {key: Topic.value}} : undefined
    }
  })
  return json({})
}

export async function DELETE({request}) {
  const {Language, PartOfSpeech, term} = await request.json()
  const partOfSpeech = PartOfSpeech.value
  const language = Language.value
  await db.word.delete({
    where: {term_partOfSpeech_language: {term, partOfSpeech, language}}
  })
  return json({})
}
