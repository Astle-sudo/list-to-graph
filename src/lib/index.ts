import { writable } from 'svelte/store';
import { persisted } from 'svelte-local-storage-store'

let showTitleBox = writable(false);
let listTree = persisted('listTree', {})

export { showTitleBox, listTree };


 