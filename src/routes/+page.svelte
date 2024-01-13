<script lang="ts">
    import { onMount } from "svelte";

    let disable: Boolean = false;

    function relocate () {
        window.location.href = '/generateGraph';
    }

    onMount(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)')
        if (!mediaQuery.matches) {
            disable = true
        }
    })
</script>

<div id="title">
    <h1>
        List-to-Graph
    </h1>
</div>

<div id="container">
    <div id="instructions">
        <h2>
            Instructions
        </h2>
        <ul>
            <li>Click the generate graph button below to generate graph page.</li>
            <li>Add and delete titles as per need</li>
            <li>If there are any issues/lags, try refreshing the page, it will re-render the graph</li>
            <li>If the edges do not render, also just refresh the page</li>
            <li>Press E to able/disable edges between the nodes</li>
            <li>Press T to able/disable the names of all nodes</li>
            <li>Optimal use on laptops/desktops only.</li>
        </ul>
    </div>
</div>

{#if !disable}
    <button on:click={relocate}>
        + Generate Graph
    </button>
{/if}

<style>
    @import url('https://fonts.googleapis.com/css2?family=Marhey&display=swap');
    :global(body) {
        font-family: 'Marhey', sans-serif;
        background-image: url('/images/Screenshot 1945-10-22 at 7.03.26 AM.png');
        background-size: 50%;
        background-repeat: repeat;
    }
    h1 {
        color: white;
    }
    li {
        text-align: left;
        margin: 5%;
    }
    button {
        padding: 1%;
        border: 2px solid white;
        color: rgb(71, 71, 71);
        background-color: white;
        font-weight: bold;
        border-radius: 10px;
        margin-left: 45%;
        margin-top: 4%;
    }
    button:hover {
        cursor: pointer;
        background-color: rgb(71, 71, 71);
        color: white;
    }
    #container {
        margin-top: 1%;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    #instructions {
        background-color: rgb(71, 71, 71);
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: column;
        color: white;
        border: 2px solid white;
        border-radius: 10px;
        padding: 1%;
        text-align: center;
    }
    #title {
        margin-top: 2%;
        text-align: center;
    }
</style>
