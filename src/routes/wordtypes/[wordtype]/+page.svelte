<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records, wordtype} = data)
</script>

<h3>{wordtype.name+'s'}</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as term}
      <tr on:dblclick={()=>rowDblClick(term)}>
        <td>
          <a href={`https://malagasyword.org/bins/teny2/${term.term}`} target="_blank">{term.term}</a>
        </td>
        <td>{term.Language?.name??''}</td>
        <td>{term.PartOfSpeech?.name??''}</td>
        <td>{term.Topic?.name??''}</td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>


