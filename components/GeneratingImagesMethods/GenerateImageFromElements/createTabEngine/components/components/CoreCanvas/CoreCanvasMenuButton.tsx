"use client";

export const CoreCanvasMenuButton = (props: {
  onClick: () => void;
  label: string;
  containerStyle?: React.CSSProperties;
  labelStyle: React.CSSProperties;
}) => {
  return (
    <div
      style={{
        width: "20px",
        height: "20px",
        cursor: "pointer",
        ...props.containerStyle,
      }}
      onClick={props.onClick}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          color: "black",
          fontSize: "15px",
          fontWeight: "bold",
          textAlign: "center",
          lineHeight: "20px",
          ...props.labelStyle,
        }}
      >
        {props.label}
      </div>
    </div>
  );
};
