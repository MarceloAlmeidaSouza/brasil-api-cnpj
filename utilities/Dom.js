export default class Dom{

    static onInserted(targetNode, callback){
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node === targetNode) {
                            callback();
                            observer.disconnect();
                        }
                    });
                }
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    static onRemoved(targetNode, callback){
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    
                    for (let removedNode of mutation.removedNodes) {
                        if(targetNode && removedNode.contains?.(targetNode)){
                            alert("contains");
                            console(targetNode);
                        }
                        if (removedNode.contains?.(targetNode)) {
                            callback();
                            observer.disconnect();
                            break;
                        }
                    }
                }
            }
        });
    
        observer.observe(document.body, { childList: true, subtree: true });
    }

    static castToElement(value){
        if(this.isNode(value) || this.isElement(value))
            return value;

        const parser = new DOMParser();
        const doc = parser.parseFromString(value, 'text/html');
        return doc.body.firstChild;
    }

    static isNode(value) {
        return value && typeof value.nodeType === 'number';
    }
    
    static isElement(value) {
        return value && value.nodeType === Node.ELEMENT_NODE;
    }

}