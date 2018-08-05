import React, {Component} from 'react';
import './ImageCanvas.css';
import { Stage, Layer, Rect, Group, Text} from 'react-konva';

class ImageCanvas extends Component {
	constructor(props){
		super(props)
		this.state = {dotLength: 6}
	}
	handleStageMouseOver = e =>{
		if(this.props.adding)
			document.body.style.cursor = 'crosshair';
	}
	handleStageMouseLeave = e =>{
		document.body.style.cursor = 'default';
	}
	handleStageMouseOut = e =>{
		document.body.style.cursor = 'default';
	}

	handleStageMouseMove = e => {
	  this.props.onCanvasStageMouseMove(e);
	}
	handleStageMouseDown = e => {
	  this.props.onCanvasStageMouseDown(e);
	}
	handleStageMouseUp = e => {
		this.props.onCanvasStageMouseUp(e);
	}
	handleGroupMouseDown = e => {
		e.target.findAncestor('Group').moveToTop()
	  this.props.onCanvasGroupMouseDown(e);
	}
	handleGroupDragStart = e => {
		this.props.onCanvasGroupDragStart(e);
	}
	handleGroupDragMove = e => {
		if(e.target.getClassName() !== 'Group')
			return;
		const group = e.target;
		const {width, height} = this.props
		const topLeft = group.get('.topLeft')[0], topRight = group.get('.topRight')[0], bottomRight = group.get('.bottomRight')[0], bottomLeft = group.get('.bottomLeft')[0];
		const top = group.get('.top')[0], left = group.get('.left')[0], right = group.get('.right')[0], bottom = group.get('.bottom')[0];
		const rect = group.get('Rect')[0];
		const text = group.get('Text')[0];
		let resizedWidth, resizedHeight;
		let absX, absY;
		let activeAnchor;
		//boundary
		for(let dot of [topLeft, topRight, bottomRight, bottomLeft, top, bottom, left, right]){
			absX = dot.getAbsolutePosition().x
			absY = dot.getAbsolutePosition().y
			absX = absX < 0 ? 0:absX;
			absY = absY < 0 ? 0:absY;
			absX = absX > width ? width:absX;
			absY = absY > height ? height:absY;
			dot.setAbsolutePosition({x: absX, y:absY})
		}
		activeAnchor = topLeft;
		const anchorX = activeAnchor.getX();
		const anchorY = activeAnchor.getY();
		topRight.y(anchorY); top.y(anchorY); bottomLeft.x(anchorX); left.x(anchorX);
		resizedHeight = bottomRight.y()-topLeft.y()
		resizedWidth = bottomRight.x()-topLeft.x()
		top.x(anchorX+resizedWidth/2); left.y(anchorY+resizedHeight/2); right.y(anchorY+resizedHeight/2); bottom.x(anchorX+resizedWidth/2);
		text.x(anchorX); text.y(anchorY);
		rect.position(topLeft.position());
		rect.width(resizedWidth);
		rect.height(resizedHeight);
	}

	handleGroupDragEnd = e => {
		this.props.onCanvasGroupDragEnd(e);
	}
	handleDotMouseOver = e => {
		const activeAnchor = e.target
		switch (activeAnchor.getName()) {
			case 'topLeft':
			case 'bottomRight':
				document.body.style.cursor = 'nwse-resize';
				break;
			case 'topRight':
			case 'bottomLeft':
				document.body.style.cursor = 'nesw-resize';
				break;
			case 'top':
			case 'bottom':
				document.body.style.cursor = 'ns-resize';
				break;
			case 'left':
			case 'right':
				document.body.style.cursor = 'ew-resize';
				break;
		}
	}
	handleDotMouseOut = e => {
		document.body.style.cursor = 'default';
	}
	handleDotMouseDown = e => {
		const group = e.target.findAncestor('Group')
		group.draggable(false)
		group.moveToTop()
		e.target.moveToTop()
		this.props.onCanvasDotMouseDown(e);
	}
	handleDotDragEnd = e => {
		this.props.onCanvasDotDragEnd(e)
		document.body.style.cursor = 'default';
	}
	handleDotDragMove = e => {
		const {width, height} = this.props
		const activeAnchor = e.target
		const group = activeAnchor.getParent();
		const topLeft = group.get('.topLeft')[0], topRight = group.get('.topRight')[0], bottomRight = group.get('.bottomRight')[0], bottomLeft = group.get('.bottomLeft')[0];
		const top = group.get('.top')[0], left = group.get('.left')[0], right = group.get('.right')[0], bottom = group.get('.bottom')[0];
		const rect = group.get('Rect')[0];
		const text = group.get('Text')[0];
		let resizedWidth, resizedHeight;
		//set box resizing boundary
		let absX = activeAnchor.getAbsolutePosition().x
		let absY = activeAnchor.getAbsolutePosition().y
		absX = absX < 0?0:absX;
		absY = absY < 0?0:absY;
		absX = absX > width?width:absX;
		absY = absY > height?height:absY;
		activeAnchor.setAbsolutePosition({x: absX, y:absY})
		const anchorX = activeAnchor.getX();
		const anchorY = activeAnchor.getY();
		// update anchor positions
		switch (activeAnchor.getName()) {
			case 'topLeft':
		  	topRight.y(anchorY); top.y(anchorY); bottomLeft.x(anchorX); left.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				top.x(anchorX+resizedWidth/2); left.y(anchorY+resizedHeight/2); right.y(anchorY+resizedHeight/2); bottom.x(anchorX+resizedWidth/2);
				text.x(anchorX); text.y(anchorY);
		    break;
			case 'topRight':
		    topLeft.y(anchorY); top.y(anchorY); bottomRight.x(anchorX); right.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				top.x(anchorX-resizedWidth/2); left.y(anchorY+resizedHeight/2); right.y(anchorY+resizedHeight/2); bottom.x(anchorX-resizedWidth/2);
				text.y(anchorY); text.x(anchorX-resizedWidth);
		    break;
		  case 'bottomRight':
		    bottomLeft.y(anchorY); bottom.y(anchorY); topRight.x(anchorX); right.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				top.x(anchorX-resizedWidth/2); left.y(anchorY-resizedHeight/2); right.y(anchorY-resizedHeight/2); bottom.x(anchorX-resizedWidth/2);
				text.x(anchorX-resizedWidth);
		    break;
		  case 'bottomLeft':
		    bottomRight.y(anchorY); bottom.y(anchorY); topLeft.x(anchorX); left.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				top.x(anchorX+resizedWidth/2); left.y(anchorY-resizedHeight/2); right.y(anchorY-resizedHeight/2); bottom.x(anchorX+resizedWidth/2);
				text.x(anchorX);
		    break;
			case 'top':
				topLeft.y(anchorY); topRight.y(anchorY);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				top.x(topLeft.x()+resizedWidth/2)
				left.y(anchorY+resizedHeight/2); right.y(anchorY+resizedHeight/2);
				text.y(anchorY);
			break;
			case 'left':
				topLeft.x(anchorX); bottomLeft.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				left.y(topLeft.y()+resizedHeight/2);
				top.x(anchorX+resizedWidth/2); bottom.x(anchorX+resizedWidth/2);
				text.x(anchorX);
			break;
			case 'right':
				topRight.x(anchorX); bottomRight.x(anchorX);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				right.y(topLeft.y()+resizedHeight/2);
				top.x(anchorX-resizedWidth/2); bottom.x(anchorX-resizedWidth/2);
				text.x(anchorX-resizedWidth)
			break;
			case 'bottom':
				bottomLeft.y(anchorY); bottomRight.y(anchorY);
				resizedHeight = bottomRight.y()-topLeft.y()
				resizedWidth = bottomRight.x()-topLeft.x()
				bottom.x(topLeft.x()+resizedWidth/2);
				left.y(anchorY-resizedHeight/2); right.y(anchorY-resizedHeight/2);
			break;
		}
		rect.position(topLeft.position());
		rect.width(resizedWidth);
		rect.height(resizedHeight);
	}
	handle = e => {} //for testing

	render() {
		const { height, width, annotations, played, focusing, adding} = this.props;
		const { dotLength } = this.state
		const layerItems = [];
		annotations.slice().reverse().forEach( anno => {

			const {x, y, width, height} = anno
			const fill = (focusing===anno.name)? anno.color.replace(/,1\)/, ",.3)"): ""
			const rect = <Rect x={0} y={0} fill={fill} width={width} height={height} stroke={anno.color} strokeWidth={1}/>
			const name = <Text offsetY={20} x={0} y={0} fontFamily={'Calibri'} text={`${anno.id}`} fontSize={16} lineHeight={1.2} fill={'#fff'} ></Text>
			let dots = []
			dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={0} y={0} key={'topLeft'} name={'topLeft'} stroke={anno.color} fill={anno.color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut}  />)
			dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={width} y={0} key={'topRight'} name={'topRight'} stroke={anno.color} fill={anno.color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
			dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={width} y={height} key={'bottomRight'} name={'bottomRight'} stroke={anno.color} fill={anno.color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
			dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={0} y={height} key={'bottomLeft'} name={'bottomLeft'} stroke={anno.color} fill={anno.color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
			dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={width/2} y={0} key={'top'} name={'top'} stroke={anno.color} fill={anno.color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut}  />)
			dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={0} y={height/2} key={'left'} name={'left'} stroke={anno.color} fill={anno.color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
			dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={width} y={height/2} key={'right'} name={'right'} stroke={anno.color} fill={anno.color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
			dots.push(<Rect offsetX={dotLength/2} offsetY={dotLength/2} x={width/2} y={height} key={'bottom'} name={'bottom'} stroke={anno.color} fill={anno.color} strokeWidth={0} width={dotLength} height={dotLength} draggable={true} dragOnTop={false} onDragMove={this.handleDotDragMove} onMouseDown={this.handleDotMouseDown} onDragEnd={this.handleDotDragEnd} onMouseOver={this.handleDotMouseOver} onMouseOut={this.handleDotMouseOut} />)
			layerItems.push(<Group x={x} y={y} key={anno.name} name={anno.name} draggable={true} onDragMove={this.handle} onMouseDown={this.handleGroupMouseDown} onDragEnd={this.handleGroupDragEnd} onDragStart={this.handleGroupDragStart} onDragMove={this.handleGroupDragMove}>{name}{rect}{dots}</Group>)


		});
		let addingLayer;
		if(adding)
			addingLayer = <Layer><Rect fill={'#ffffff'} width={width} height={height} opacity={.3} /><Text y={height/2} width={width} text={'Click and Drag here to add new box'} align={'center'} fontSize={16} fill={'#fff'} /></Layer>
		return(
						<Stage width={width} height={height} className="konva-wrapper" onMouseDown={this.handleStageMouseDown} onMouseUp={this.handleStageMouseUp} onMouseMove={this.handleStageMouseMove} onMouseOver={this.handleStageMouseOver} onMouseLeave={this.handleStageMouseLeave} onMouseOut={this.handleStageMouseOut}>
							 {addingLayer}
							 <Layer>{layerItems}</Layer>
				    </Stage>
					);
	}
}
export default ImageCanvas;
