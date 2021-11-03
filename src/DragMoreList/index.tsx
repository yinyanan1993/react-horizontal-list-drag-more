import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import styles from './index.less';

interface DragConfigProps {
  onMore: () => void;
  defaultText?: string; // 默认的文字
  draggingText?: string; // 加载更多的文字
  paddingLeft?: string; // 左边距
  dragCardStyles?: object; // 更多滑块的样式，不可设置背景颜色，会被dragBgColor覆盖
  dragBgColor?: string; // 更多滑块背景颜色，
}

interface DragMoreBoxProps extends DragConfigProps {
  children: React.ReactChild;
}

// 拖拽跳查看更多->
export const DragMoreBox = (props: DragMoreBoxProps) => {
  const {
    onMore,
    defaultText = '查看更多',
    draggingText = '松开查看',
    paddingLeft,
    dragCardStyles = {},
    dragBgColor = '#f5f5f5',
  } = props;
  const DISTANCE_MAX = 62; // 滑块移动的最大距离
  const DRAG_MAX = 120; // 手指拖动最大响应距离
  const DISTANCE_LINE = 20; // 查看更多事件的触发边界

  const touchX = useRef(0); // 记录滑动触点
  const scrollRef = useRef<HTMLDivElement>(); // list content element
  const [trans, setTrans] = useState(0); // translate 距离
  const [dragging, setDragging] = useState(false); // 拖动到目标位，查看更多

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const pageX = e.changedTouches[0].pageX;
    const listEl = scrollRef.current;
    const scrollDistance =
      listEl.offsetWidth + listEl.scrollLeft - listEl.scrollWidth;
    if (scrollDistance > 1) {
      // iphone 可滚动距离大于滚动条。使用自带的弹性滚动判断拖拽距离
      // 安卓也会出现大于滚动条，测试机型滚动溢出在1以内。这里后续可视用户反馈 决定是否添加 iphone判断
      setTrans(0);
      setDragging(scrollDistance > DISTANCE_LINE);
    } else if (scrollDistance >= -1) {
      // 安卓部分机型 scrollLeft 会出现小数，并且scrollDistance>0的情况
      if (touchX.current === 0) {
        touchX.current = pageX;
        return;
      }
      const dragDistance = touchX.current - pageX; // 手指拖动距离
      const d =
        // eslint-disable-next-line no-nested-ternary
        dragDistance < 0
          ? 0
          : dragDistance > DRAG_MAX
          ? DRAG_MAX
          : dragDistance; // 受限的距离
      // 函数处理 拉动越来越慢
      const transD =
        DISTANCE_MAX - (DISTANCE_MAX / DRAG_MAX ** 2) * (d - DRAG_MAX) ** 2;

      setDragging(transD > DISTANCE_LINE);
      setTrans(transD);
    } else {
      if (trans > 0) setTrans(0);
      if (dragging) setDragging(false);
    }
  };

  const onTouchEnd = () => {
    touchX.current = 0;
    if (dragging) {
      setTimeout(() => {
        onMore();
        setDragging(false);
      }, 100);
    }
    setTrans(0);
  };

  const onTouchCalcel = () => {
    touchX.current = 0;
    setDragging(false);
    setTrans(0);
  };

  return (
    <div
      className={styles.dragWrap}
      style={{
        transform: `translateX(-${trans}px)`,
      }}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCalcel}>
      <div ref={scrollRef} className={styles.cardList} style={{ paddingLeft }}>
        <div className={styles.before} style={{ background: dragBgColor }} />
        {props.children}
        <div className={styles.moreWrap}>
          <div
            onClick={() => onMore()}
            className={styles.innerBox}
            style={{
              width: '62px',
              ...dragCardStyles,
              background: dragBgColor,
            }}>
            <div
              className={classNames(
                styles.moreIcon,
                dragging ? styles.iconRotate : '',
              )}
              style={{ width: '15px', height: '15px' }}
            />
            <div className={styles.moreText}>
              {dragging ? draggingText : defaultText}
            </div>
          </div>
        </div>
        <div className={styles.after} style={{ background: dragBgColor }} />
      </div>
    </div>
  );
};

interface DragMoreList<T> extends DragConfigProps {
  list: T[];
  renderCard: (data: T) => JSX.Element;
  spacing?: string; // 卡片间距
  disableDrag?: boolean; // 取消拖拽
}

function DragMoreList<T>(props: DragMoreList<T>) {
  const {
    list,
    renderCard,
    spacing,
    disableDrag = false,
    ...innerProps
  } = props;

  // 卡片列表
  const inner = (
    <React.Fragment>
      {list.map((item: T, index) => (
        <div
          key={index}
          className={styles.cardWrapper}
          style={{ paddingRight: spacing }}>
          {renderCard(item)}
        </div>
      ))}
    </React.Fragment>
  );

  return (
    <div className={styles.dragMoreListComponent}>
      {disableDrag ? (
        <div
          className={styles.cardList}
          style={{ paddingLeft: innerProps.paddingLeft }}>
          {inner}
        </div>
      ) : (
        <DragMoreBox {...innerProps}>{inner}</DragMoreBox>
      )}
    </div>
  );
}

export default DragMoreList;
