import db from '$lib/server/database.js'

export const load = async ({params}) => {
  const entity = {
    attributes: {
      term: {name:'Term'},
      language: {name:'Language'},
      root: {name:'Root Form'},
      partOfSpeech: {name:'Part of Speech'},
      standard: {name:'Standard Term'},
      english: {name:'English'},
      Topic: {name:'Topic'}
    },
    endpoint: 'word',
    isEditable: true,
    name: 'Words'
  }
  const records = await db.word.findMany({
    where:{term:params.word},
    include: {Language:true,PartOfSpeech:true,Topic:true},
    orderBy: {term:'asc'},
    take:5000
  })
  //console.log(records[0])
  return {entity, records}
}