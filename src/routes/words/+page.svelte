<script>
// @ts-nocheck

  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records} = data)
</script>

<h3>Words</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as term}
      <tr on:dblclick={()=>rowDblClick(term)}>
        <td>
          <a href={`/words/${term.term}`}>{term.term}</a>
        </td>
        <td>{term.Language?.name??''}</td>
        <td>{term.PartOfSpeech?.name??''}</td>
        <td>{term.Topic?.name??''}</td>
        <td>{term.root??''}</td>
        <td>{term.standard??''}</td>
        <td>{term.english??''}</td>
        <td>{term.comment??''}</td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>


