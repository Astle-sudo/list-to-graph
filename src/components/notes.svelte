<script>
// @ts-nocheck

    import { showTitleBox } from "$lib";
    import { listTree } from "$lib";
    import { onMount } from "svelte";
    export let title;
    export let children;
    /**
     * @type {HTMLDivElement}
     */
    let points;
    let mainNode;
    let Title;
    /**
     * @param {{ key: string; }} e
     */
    function insertPoint (e) {
        if (e.key === 'Enter') {
            enterChild('')
        }
        if (e.key === 'Backspace') {
            if (this.value == '' && this.parentNode != points.firstChild) {
                e.preventDefault()
                let l = points.children[points.children.length-2]
                let I = l.firstChild;
                I.focus();
                points.removeChild(this.parentNode);
            }
        }
    }

    function enterChild (val) {
        let newPoint = document.createElement('li');
        let inputInPoint = document.createElement('input');

        inputInPoint.type = 'text';
        inputInPoint.onkeydown = insertPoint;
        inputInPoint.onkeyup = keyUphandler;
        inputInPoint.style.textDecoration = 'none';
        inputInPoint.style.outline = 'none';
        inputInPoint.style.border = 'none';
        inputInPoint.style.fontWeight = 'bold';
        inputInPoint.style.backgroundColor = 'rgb(81, 81, 81)'
        inputInPoint.style.color = 'white';
        inputInPoint.value = val;
        newPoint.style.margin = '4%';
        newPoint.style.color = 'white';
        newPoint.appendChild(inputInPoint);
        points.appendChild(newPoint);
    }

    /**
     * @param {{ key: string; }} e
     */
    function keyUphandler (e) {
        if (e.key === 'Enter' || e.key === 'Backspace') {
            let l = points.lastChild;
            let I = l.firstChild;
            I.focus();
        }
    }

    function removeNode () {
        let temp = {...$listTree};
        delete temp[title];
        listTree.set(temp);
        close();
    }

    function retriveData () {

        let firstTitle = Title.value;
        let childList = [];
        for (let i = 0; i < points.childElementCount; i++) {
            if (points.children[i].firstChild.value != "") {
                childList.push(points.children[i].firstChild.value);
            }
        }
        $listTree[firstTitle] = childList;
        if (firstTitle != title) {delete $listTree[title];}
        close();

    }

    function close () {$showTitleBox = false; mainNode.parentNode.removeChild(mainNode);}

    onMount(() => {
        if (children.length > 0 || title != '') {
            if (children.length == 0) {children.push('');}
            document.getElementById('title').value = title;    
            for (let c of children) {
                enterChild(c);
            }
        }
        else {
            enterChild('');
        }
    })
</script>

<main bind:this={mainNode}>
    <div id="button-container">
        <button on:click={close}>X</button>
    </div>
    <input bind:this={Title} id="title" type="text" placeholder="Title">
    <div id="points" bind:this={points}></div>
    <div id="button-container">
        <button on:click={removeNode}>
            Delete
        </button>
        <button on:click={retriveData}>
            Done
        </button>
    </div>
</main>

<style>
    main {
        position: absolute;
        height:40vh;
        width: 40vw;
        margin-top: 25vh;
        margin-left: 30vw;
        border: 1px solid white;
        overflow-y: scroll;
        box-shadow: 1px 1px 1px 1px white;
        background-color: rgb(81, 81, 81);
        z-index: 1;
    }
    input {
        text-decoration: none;
        border: none;
        outline: none;
        background-color: rgb(81, 81, 81);
        color: white;
    }
    button {
        outline: none;
        border: none;
        font-weight: bolder;
        padding: 1.5% 2% 0% 0%;
        background-color: inherit;
        color: white;
    }
    button:hover {
        cursor: pointer;
    }
    #title {
        margin: 5% 0% 0% 20%;
        scale: 2;
    }
    #button-container {
        display: flex;
        flex-direction: row;
        justify-content: end;
    }
    #points {
        margin-top: 2%;
        margin-left: 12%;
        height: 65%;
        overflow-y: scroll; 
    }
</style>