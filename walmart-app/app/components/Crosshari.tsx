const Crosshair = () => {
  return (
    <div
      id="crosshair"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "10px",
        height: "10px",
        background: "white",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        opacity: 0.7,
      }}
    />
  );
};

export default Crosshair;
