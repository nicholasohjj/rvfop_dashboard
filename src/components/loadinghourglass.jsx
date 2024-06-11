import { Hourglass } from "react95";

export const LoadingHourglass = () => {
  return (
    <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    Loading...
    <Hourglass size={32} style={{ margin: 20 }} />
  </div>
  );
}