export function zoom(node:HTMLElement, scale = 1.5) {
	node.style.transition = '1s'
    let tmp = node.style.maxWidth;

    document.body.style.overflow = "auto";

	function zoomIn() {
        node.style.maxWidth = "100%";
        node.style.zIndex = "100";
		node.style.transform = `scale(${scale})`
	}
	function zoomOut() {
		node.style.maxWidth = tmp;
        node.style.zIndex = "0";
        node.style.transform = 'scale(1)'
	}
	node.addEventListener('click', zoomIn)
	node.addEventListener('dblclick', zoomOut)

	return {
		destroy() {
			node.removeEventListener('mouseenter', zoomIn)
			node.removeEventListener('mouseleave', zoomOut)
		}
	}
}