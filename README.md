# react-horizontal-list-drag-more
>  h5 弹性左滑松开查看更多，同理可做弹性上拉加载

## config

| 属性（*必填）        | 类型                      | 默认值         | 备注                                                       |
| -------------------- | ------------------------- | -------------- | ---------------------------------------------------------- |
| ``defaultText``      | ``string``                | ``"查看更多"`` | 默认的文字                                                 |
| ``draggingText``     | ``string``                | ``"松开查看"`` | 加载更多的文字                                             |
| ``paddingLeft``      | ``String``                | ``"16px"``     | 列表左边距                                                 |
| ``dragCardStyles``   | ``Object``                |                | 更多滑块的样式，不可设置背景颜色，会被``dragBgColor`` 覆盖 |
| ``dragBgColor``      | ``string``                | ``"#f5f5f5"``  | 更多滑块背景颜色                                           |
| ``spacing``          | ``string``                | ``"16px"``     | 卡片间距                                                   |
| ``disableDrag``      | ``boolean``               | ``false``      | 取消左滑查看                                               |
| ***** ``list``       | ``T[]``                   |                | 卡片数据列表                                               |
| ***** ``renderCard`` | ``(item:T)=>JSX.Element`` |                | 单个卡片的render方法                                       |
| ***** ``onMore``     | ``()=>{}``                |                | “查看更多”回调方法                                         |


## use

> 参考 ``/example/index.tsx``

```tsx
import DragMoreList from 'react-horizontal-list-drag-more';

<DragMoreList
  list={data_list}
  renderCard={single_card_render_fun}
  onMore={on_more_fun}
  {...other_config}
/>
```