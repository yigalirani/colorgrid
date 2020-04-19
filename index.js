function Input({value,set_value}){
	function onChange(e){
		set_value(e.target.value)
	}
	return <input type="text" {...{value,onChange}} />
}
function Cell({row,col,store}){
	var value=store.get(row,col)
	var set_value=value=>store.set(row,col,value)
	return <td style={{'background':store.get(row,col) }} >
		<Input {...{value,set_value}}/>
	</td>
} 
function ColorRow({size,row,store}){
	return <tr>{rmap(size,col=><Cell {...{key:col,row,col,store}} />)}</tr>
}
function rmap(size,f){
	return [...Array(size).keys()].map(f)
}
function colorsStore([values,set_values]){
	var key=(row,col)=>row+'-'+col
	function get(row,col){
		return values[key(row,col)]||''
	}
	function load(){
		var loaded_values=JSON.parse(localStorage.getItem('colorgrid'))||{'0-0':'red'}
		set_values(loaded_values)
	}	
	function set(row,col,color){
		var new_values={}
        Object.assign(new_values, values);
        new_values[key(row,col)]=color
		set_values(new_values)
		localStorage.setItem('colorgrid', JSON.stringify(new_values||{}));
	}
	return {get,set,load}
}
function useStore(){
	var store = colorsStore(React.useState({}))	
	React.useEffect(_=>{ 
		store.load()
	}, [])	
	return store	
}
function ColorGrid(){
	var store=useStore()
	var size=4
	return <table><tbody>{rmap(4,row=><ColorRow {...{key:row,size,row,store}} /> )}</tbody></table>

}
ReactDOM.render(<ColorGrid/>,document.getElementById('root'))