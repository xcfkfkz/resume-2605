import { createElement, cloneElement, isValidElement } from 'react';
import type { ReactElement, ComponentType } from 'react';
import { useEventEmitter, useCreation } from 'ahooks';

interface TabItemProps {
  key: string;
  children?: React.ReactNode;
  [key: string]: any;
}

interface UseOnActivatedOrNot {
  useOnActivatedOrNot: (callback: (isActive: boolean) => void) => void;
}

export default (items: TabItemProps[]) => {
  const event$ = useEventEmitter<string>();
  return {
    onTabKeyChange(activeKey: string) {
      event$.emit(activeKey);
    },
    items: useCreation(
      () =>
        items.map(({ key, children, ...restProps }) => {
          let children2 = children;
          const useOnActivatedOrNot = (effectCallback: (isActive: boolean) => void) => {
            event$.useSubscription(activeKey => {
              effectCallback(key === activeKey);
            });
          };
          if (isValidElement(children)) {
            children2 = cloneElement(children as ReactElement<UseOnActivatedOrNot>, {
              useOnActivatedOrNot,
            });
          } else if (typeof children === 'function') {
            children2 = createElement(children as ComponentType<UseOnActivatedOrNot>, {
              useOnActivatedOrNot,
            });
          }
          return {
            children: children2,
            key,
            ...restProps,
          };
        }),
      [items, event$],
    ),
  };
};
