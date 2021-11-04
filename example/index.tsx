import { DragMoreList } from "../src";

const Example = () => {
  const list = [1,2,3,4,5];
  return (
    <DragMoreList
      list={list}
      renderCard={item => <div style={{width: '100px', height: '100px', background: '#f00', borderRadius: '6px'}}></div>}
      onMore={() => {console.log('查看更多')}}
      disableDrag={false}
      defaultText="查看更多"
      draggingText="松开查看"
      dragCardStyles={{ borderRadius: '6px 0 0 6px' }}
    />
  )
}

export default Example;