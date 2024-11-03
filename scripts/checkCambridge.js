import {writeFile, readFile} from 'fs/promises'
import {existsSync} from 'fs'
import {resolve} from 'path'
import {getDocument} from 'pdfjs-dist'

// https://www.ef.com/wwen/english-resources/english-vocabulary/

const input = {
  remote: new URL('images/506887-b1-preliminary-2020-vocabulary-list.pdf', 'https://www.cambridgeenglish.org'),
  local: resolve('data','vocabulary.pdf')
}
const output1 = resolve('data','vocabulary.json')
const output2 = resolve('data','topicLists.json')

const topics = [
  'Clothes and Accessories',
  'Colours',
  'Communications and Technology',
  'Education',
  'Entertainment and Media',
  'Environment',
  'Food and Drink',
  'Health, Medicine and Exercise',
  'Hobbies and Leisure',
  'Home',
  'Language',
  'Personal Feelings, Opinions and Experiences',
  'Places: Buildings',
  'Places: Countryside',
  'Places: Town and City',
  'Services',
  'Shopping',
  'Sport',
  'The Natural World',
  'Time',
  'Travel and Transport',
  'Weather',
  'Work and Jobs'
]

async function downloadFile(remote,local) {
  const response = await fetch(remote)
  if (response.ok) {
    const arrayBuffer = await response.arrayBuffer()
    await writeFile(local, Buffer.from(arrayBuffer))
    return true
  } 
}

function parseWords(items) {
  const left = []
  const right = []
  let y1 = 0
  let y2 = 0
  for (const item of items) {
    item.x = Math.round(item.transform[4]/10)
    item.y = Math.round(item.transform[5]/10)
    const text = item.str
    if (item.y >= 8 && item.y <= 79) { // skip header and footer
      if (text) {
        if (text !==' ') {
          if (item.x < 30) {
            //console.log(`${item.y} ${text}`) 
            if (item.y === y1) {
              let word = left.pop() ?? ''
              word += word ? ' ' + text : text
              left.push(word)
            } else {
              y1 = item.y
              left.push(text)
            }
          } else {
            if (item.y === y2) {
              let word = right.pop() ?? ''
              word += word ? ' ' + text : text
              right.push(word)
            } else {
              y2 = item.y
              right.push(text)
            }
          }
        }
      }
    }
  }
  return left.concat(right)
}

function parseTopicLists(items, topic) {
  const words = []
  for (const item of items.slice(0,1000)) {
    item.x = Math.round(item.transform[4]/10)
    item.y = Math.round(item.transform[5]/10)
    const text = item.str
    if (item.y >= 8 && item.y <= 79) { // skip header and footer
      if (text) {
        if (/^[A-Z]/.test(text)) {
          let fixedTopic = text.replace(/^Places:$/,'Places: Countryside').replace(/\s\(Adjectives\)$/,'')
          if (topics.includes(fixedTopic)) {
            topic = fixedTopic
          }
        }
        if (text !==' ' && !topics.concat(['Appendix 2','Topic Lists','Countryside']).includes(text)) {
          if ([9,10,20,21,31,32,42,43].includes(item.x)) {
            words.push({word:text,topic})
          } else {
            if (words.length) {
              let {word,topic} = words.pop()
              //console.log(`${word} + ${text} => ${word} ${text}`) 
              word += ' ' + text
              words.push({word,topic})
            } else {
              console.log(`${item.x} ${text}`) 
            }
          }
        } 
      }
    }
  }
  return {words, topic}
}

async function getVocabulary() {
  const vocabulary = []
  for (let i=4; i<=39; i++) {// pages 4 to 39
    const page = await doc.getPage(i)
    const {items} = await page.getTextContent()
    const words = parseWords(items)
    vocabulary.push(...words)
  }
  return vocabulary.filter(word =>
    word.endsWith(')')
    && !word.startsWith('•') 
    && !word.startsWith('(') 
    && !word.includes('(Br Eng)')
    && !word.includes('(Am Eng)')
  )
}

if (!existsSync(input.local)) {
  const success = await downloadFile(input.remote,input.local)
  if (success) {
    console.log(`Downloaded PDF to ${input.local}`)
  } else {
    console.log(`File download from ${input.remote} failed`) 
  }
}

const {buffer} = await readFile(input.local)
const doc = await getDocument(buffer).promise
//console.log(`The document has ${doc.numPages} pages`)

const words = await getVocabulary()
await writeFile(output1, JSON.stringify(words,undefined,2))
console.log(`${words.length} words written to ${output1}`)

const topicLists = []
let topic = 'Clothes and Accessories'
for (let i=41; i<=51; i++) { // pages 41 to 51
  const page = await doc.getPage(i)
  const {items} = await page.getTextContent()
  const results = parseTopicLists(items,topic)
  topicLists.push(...results.words)
  topic = results.topic
}
await writeFile(output2, JSON.stringify(topicLists,undefined,2))
console.log(`${topicLists.length} words written to ${output2}`)
