import { useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMemoizedFn, useRequest } from "ahooks";

interface AutoCompleteProps {
  inputRender: (params: {
    onElMounted: (el: HTMLElement | null | undefined) => void;
    onFocus: () => void;
    onBlur: () => void;
    onSearchTermChange: (searchTerm: string) => void;
    onChange: (val: string) => void;
    value?: string;
  }) => ReactNode;
  onChange?: (val: string) => void;
  value?: string;
}

interface SearchResult {
  saying: string;
}

export default function AutoComplete({
  inputRender,
  onChange,
  value,
}: AutoCompleteProps) {
  const [popupContainer, setPopupContainer] = useState<HTMLElement | null>(
    null
  );
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [activated, setActivated] = useState(false);
  const { data, run } = useRequest(
    (searchTerm: string) =>
      new Promise<SearchResult[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              saying: "erwerw" + searchTerm,
            },
          ]);
        }, 200);
      }),
    {
      manual: true,
    }
  );
  const open = activated && !!data?.length;
  const onElMounted = useMemoizedFn((el: HTMLElement | null | undefined) => {
    if (el) {
      setPopupContainer(el?.parentNode as HTMLElement | null);
    }
  });
  const onFocus = useMemoizedFn(() => {
    setActivated(true);
  });
  const onBlur = useMemoizedFn(() => {
    if (!isMouseDown) {
      setActivated(false);
    }
  });
  const onSearchTermChange = useMemoizedFn((searchTerm: string) => {
    run(searchTerm);
  });
  return (
    <>
      {inputRender({
        onElMounted,
        onFocus,
        onBlur,
        onSearchTermChange,
        onChange: onChange ?? (() => {}),
        value: value as string,
      })}
      {!!popupContainer &&
        createPortal(
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                height: "400px",
                width: "100%",
                background: "#fff",
                border: "1px solid lightgray",
                borderRadius: "5px",
                boxShadow: "0 0 2px lightgray",
                display: open ? "block" : "none",
              }}
              onMouseDown={() => {
                setIsMouseDown(true);
              }}
              onMouseUp={() => {
                setIsMouseDown(false);
              }}
            >
              {data?.map(({ saying }) => (
                <div
                  onClick={() => {
                    onChange?.(saying);
                    setActivated(false);
                  }}
                >
                  {saying}
                </div>
              ))}
            </div>
          </div>,
          popupContainer
        )}
    </>
  );
}
