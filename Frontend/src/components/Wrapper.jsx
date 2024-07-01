

const Wrapper = ({hidden, children}) =>{
    if(hidden) return null;
    return children;
}

export default Wrapper;