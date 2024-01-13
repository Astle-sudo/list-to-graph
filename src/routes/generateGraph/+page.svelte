<script lang="ts">
// @ts-nocheck

    import { onMount } from "svelte";
    import { showTitleBox } from "$lib";
    import { listTree } from "$lib";
    import { Graph } from "./classes";
    import { Node } from "./classes";
    import { Edge } from "./classes";
    import Notes from "../../components/notes.svelte";
    import P5 from 'p5-svelte';

    let back: any;
    let addTitle: any;
    let titleContainer: any;
    let nodeList: string[];
    let mode: string = 'circle';
    let stateSpace: Graph;
    let selectedNode: string;
    let showEdges: Boolean = true;
    let detectSelect: Boolean = false;

    function showNote (title) {
        new Notes ({
            target: document.body,
            props: {
                title: title,
                children: $listTree[title],
            }
        })
        $showTitleBox = true;
    }

    function relocate () {
        window.location.href = '/'
    }

    $: {
        if ($listTree) {
            nodeList = Object.keys($listTree); 
        }
    }

    const sketch = (p5) => {

        function Includes(rNodes, node) {
            for (let r of rNodes) {
                if (r.x == node.x && r.y == node.y) {
                    return true;
                }
            }
            return false;
        }

        function generateRandomPoints(cx, cy, radius) {
            let angle = p5.random(0, p5.TWO_PI);
            let x = cx + radius * p5.cos(angle);
            let y = cy + radius * p5.sin(angle);
            return [x, y];
        }

        function edgeHighlight(node, YN) {
            let relations = []; let relatedNodes = [];
            for (let s of stateSpace.edges) {
                if (s.source == node) {
                    relations.push(s);
                    relatedNodes.push(s.target);
                }
                if (s.target == node) {
                    relations.push(s);
                    relatedNodes.push(s.source);
                }
            }
            if (YN) {
                for (let r of relations) {
                    r.c = 200;
                    r.w = 2;
                }
                for (let s of stateSpace.nodes) {
                    if (Includes(relatedNodes, s)) {
                        s.showText = true;
                    }
                }
            }
            else {
                for (let r of relations) {
                    r.c = 100;
                    r.w = 1;
                }
                for (let s of stateSpace.nodes) {
                    if (Includes(relatedNodes, s)) {
                        s.showText = false;
                    }
                }
            }
        }

        function getTuples(obj) {
            function setStatus(name, status) {
                if(!map.has(name)) {
                    map.set(name, status); 
                }
                else if(map.get(name) === 'child') { 
                    map.set(name, status);
                }
            }
            
            let tuples = [];
            let keys = Object.keys(obj);
            let map = new Map();
            
            for(let key of keys) {
                setStatus(key, 'main');
                obj[key].forEach(value => {
                    setStatus(value, 'child'); 
                });
            }
            
            map.forEach((status, name) => {
                tuples.push([name, status]);  
            });
            return tuples;  
        }

        function getNodes(nodesArr, title) {
            return nodesArr.filter(node => {
                return node.title === title;
            })[0];
        }

        function drawNodes(node) {
            p5.push();
            p5.stroke(0);
            p5.strokeWeight(2);
            p5.fill(node.c);
            p5.circle(node.x, node.y, node.radius);
            if (node.showText) {
                p5.text(node.title, node.x-20, node.y-20);
            }
            if (p5.dist(p5.mouseX, p5.mouseY, node.x, node.y) < node.radius + node.radius / 2) {
                if (detectSelect) {
                    if (selectedNode == undefined) {
                        node.x = p5.mouseX;
                        node.y = p5.mouseY;
                        selectedNode = node.title;
                        edgeHighlight(node, true);
                    }
                    else if (selectedNode == node.title) {
                        node.x = p5.mouseX;
                        node.y = p5.mouseY;
                        edgeHighlight(node, true);
                    }
                }
                else {edgeHighlight(node, false)}
                p5.text(node.title, node.x-20, node.y-20);
            }
            p5.pop();
        }

        function drawEdge(edge) {
            p5.push();
            p5.stroke(edge.c);
            p5.strokeWeight(edge.w);
            p5.line(
                edge.source.x, edge.source.y,
                edge.target.x, edge.target.y
            )
            p5.pop();
        }

         p5.mousePressed = () => {
            detectSelect = true;
        }
        
         p5.mouseReleased = () => {
            detectSelect = false;
            selectedNode = undefined;
        }

         p5.keyPressed = () => {
            if (p5.key === 't') {
                if (stateSpace.showingText) {
                    for (let n of stateSpace.nodes) {
                        n.showText = false;
                    }
                    stateSpace.showingText = false;
                }
                else {
                    for (let n of stateSpace.nodes) {
                        n.showText = true;
                    }
                    stateSpace.showingText = true;
                }
            }
            if (p5.key === 'e') {
                if (showEdges == false) {showEdges = true}
                else if (showEdges == true)  {showEdges = false}
            }
        }

        p5.setup = () => {
            p5.createCanvas(1150, 920);
            
            stateSpace = new Graph(false);
            
            for (let n of getTuples($listTree)) {
                let x; let y;
                if (mode == 'circle') {
                    if (n[1] == "child") {
                        let pos = generateRandomPoints(572, 430, p5.random(300,400));
                        x = pos[0];
                        y = pos[1];
                    }
                    else {
                        x = p5.random(250, 900);
                        y = p5.random(250, 600);
                    }
                }
                else {
                    x = p5.random(250, 900);
                    y = p5.random(250, 900);
                }
                stateSpace.addNode(new Node (x,y,n[0],n[1], false));
            }
            
            for (let o of Object.keys($listTree)) {
                let main = getNodes(stateSpace.nodes, o);
                for (let c of $listTree[o]) {
                    let childref = getNodes(stateSpace.nodes, c);
                    stateSpace.addEdge(new Edge(main, childref, 100, 1));
                }
            }
        };
        
        p5.draw = () => {
            p5.background(51);
            
            if (showEdges) {
                for (let edge of stateSpace.edges) {
                    drawEdge(edge);
                }
            }
            
            for (let node of stateSpace.nodes) {
                drawNodes(node);
            }
        };
    };

    onMount(() => {
        addTitle.addEventListener('click', function () {
            if (!$showTitleBox) {$showTitleBox = true}
        })
        back.addEventListener('click', relocate)
    })
</script>

<div id="container" bind:this={titleContainer}>
    <div id="title-container">
        <h4 bind:this={addTitle}>+ Add titles</h4>
    </div>
    {#each nodeList as node}
        <button on:click={showNote(node)}>
            {node}
        </button>
    {/each}
</div>

<div bind:this={back} id="back">
    &#8676;
</div>

{#if $showTitleBox}
    <Notes title='' children={[]}/>
{/if}

{#key $listTree}
    <div id="p5">
        <P5 {sketch} />
    </div>
{/key}

<style>
    :global(body) {
        background-image: url('/images/Screenshot 1945-10-22 at 7.03.26 AM.png');
    }
    h4 {
        width: fit-content;
    }
    h4:hover {
        cursor: pointer;
        color: grey;
    }
    button {
        margin-top:  15%;
        margin-left:  10%;
        width:  80%;
        height:  8%;
        text-align:  center;
        font-weight:  550;
        outline:  none;
        background-color:  inherit;
        text-decoration:  none;
        border:  2px solid white;
        border-radius:  5px;
        color: white;
    }
    button:hover {
        cursor: pointer;
        background-color: white;
        color: rgb(71,71,71);
    }
    #title-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    #container {
        position: absolute;
        border: 2px solid white;
        border-radius: 10px;
        height: 60vh;
        width: 15vw;
        margin-top: 15vh;
        overflow-y: scroll;
        box-shadow: 1px 1px 1px 1px white;
        color: white;
        background-color: rgb(81, 81, 81);
        z-index: 1;
    }
    #back {
        color: white;
        position: absolute;
        scale: 3;
        left: 1.5%;
        top: 3%;
    }
    #back:hover {
        cursor: pointer;
    }
    #p5 {
        position: absolute;
        top: 0%;
        left: 20%;
        z-index: 0;
    }
</style>
