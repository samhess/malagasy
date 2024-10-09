import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name:'Term'},
      Language: {name:'Language', key:'code'},
      PartOfSpeech: {name:'Part of Speech', key:'code'},
      Topic: {name:'Topic', key:'key'},

    },
    endpoint: 'word',
    isEditable: true,
    name: 'Topic List'
  }
  const topics = await db.topic.findMany({
    orderBy: {name:'asc'},
  })
  const records = await db.word.findMany({
    where: {language:{in:['eng','ena','enb']}},
    include: {PartOfSpeech:true, Language:true, Topic:true},
    orderBy: {term:'asc'},
  })
  //console.log(records[0])
  return {entity, records, topics}
}