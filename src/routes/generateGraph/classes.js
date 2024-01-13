export class Graph {
    constructor(showingText) {
      this.nodes = [];
      this.edges = [];
      this.showingText = showingText;
    }

    addNode (node) {
      this.nodes.push(node);
    }
    
    addEdge (edge) {
      this.edges.push(edge);
    }
}
export class Node {
    constructor(x, y, title, status, showText) {
        this.x = x;
        this.y = y;
        this.title = title;
        this.status = status;
        this.showText = showText;
        if (this.status == "main") {
            this.c = 255;
            this.radius = 20;
        }
        else {
            this.c = 200;
            this.radius = 10;
        }
    }
}
export class Edge {
    constructor(source, target, c, w) {
        this.source = source;
        this.target = target;
        this.c = c;
        this.w = w;
    }
}