"use client";
import { useEffect, useState } from "react";

export type OpacitySliderProps = {
  opacity: number;
  dismiss: () => void;
  onStart: (opacity: number) => void;
  onEnd: (opacity: number) => void;
  onUpdate: (opacity: number) => void;
};

export const OpacitySlider = (props: OpacitySliderProps) => {
  useEffect(() => {
    const dismiss = () => {
      props.dismiss();
    };
    window.addEventListener("click", dismiss);
    return () => {
      window.removeEventListener("click", dismiss);
    };
  }, [props.dismiss]);

  const [opacity, setOpacity] = useState(props.opacity);

  function onStart() {
    setOpacity(props.opacity);
    props.onStart(opacity);
  }

  function onEnd() {
    props.onEnd(opacity);
  }

  function onUpdate(event: { target: { value: string } }) {
    const opacity = parseFloat(event.target.value);
    setOpacity(opacity);
    props.onUpdate(opacity);
  }

  return (
    <div className="opacity-slider core-floating-card">
      <div className="top-row">
        <div className="label">Transparency</div>
        <div>
          <div className="value">{props.opacity.toFixed(0)}%</div>
        </div>
        {/* <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={props.opacity}
                onChange={(event) => {
                    const opacity = parseFloat(event.target.value);
                    props.onChange(opacity);
                }}
            /> */}
      </div>
      <div className="bottom-row">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          // value={props.opacity}
          // onChange={(event) => {
          //   const opacity = parseFloat(event.target.value);
          //   props.onChange(opacity);
          // }}
          value={opacity}
          onMouseDown={onStart}
          onMouseUp={onEnd}
          onTouchStart={onStart}
          onTouchEnd={onEnd}
          onChange={onUpdate}
        />
      </div>
    </div>
  );
};
